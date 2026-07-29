import React from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { AuthHeader } from './AuthHeader'
import { AuthCardBody } from './AuthCardBody'
import { Text } from '../../../components/Text'
import { listUsers } from '../../../services/userMetadata/registry'
import { RegisteredUser } from '../../../services/userMetadata/types'
import { deleteAccount } from '../../../services/auth/accountFlows'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'

// Most recently used first. ISO timestamps, so lexicographic comparison is chronological.
const lastLogin = (u: RegisteredUser) => u.lastActiveAt ?? u.createdAt ?? ''

export const ManageOfflineUsers = () => {
  const [accounts, setAccounts] = React.useState<RegisteredUser[]>([])
  const { color, palette } = useColor()
  const translate = useTranslate()

  const loadAccounts = React.useCallback(async () => {
    const list = await listUsers()
    setAccounts([...list].sort((a, b) => lastLogin(b).localeCompare(lastLogin(a))))
  }, [])

  React.useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const handleDelete = (account: RegisteredUser) => {
    // Accounts saved online can be restored by logging in again; local-only ones cannot.
    const consequence = account.isPendingSync
      ? translate('delete_account_not_synced')
      : translate('delete_account_device_only')
    Alert.alert(
      translate('are_you_sure'),
      `${translate('delete_account')} (${account.name})?\n\n${consequence}`,
      [
        { text: translate('cancel'), style: 'cancel' },
        {
          text: translate('delete_account'),
          style: 'destructive',
          onPress: async () => {
            await deleteAccount(account.id)
            await loadAccounts()
          },
        },
      ],
    )
  }

  return (
    <>
      <AuthHeader title={'manage_accounts'} />
      <AuthCardBody>
        {accounts.length === 0 ? (
          <Text style={styles.emptyText}>no_accounts_on_device</Text>
        ) : (
          <ScrollView
            style={styles.list}
            persistentScrollbar={true}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {accounts.map((account, index) => (
              <React.Fragment key={account.id}>
                {index > 0 && <View style={styles.separator} />}
                <View style={styles.userRow}>
                  <View style={styles.userInfo}>
                    <FontAwesome name="user-circle" size={24} color={color} style={styles.icon} />
                    <Text style={styles.userName} enableTranslate={false}>
                      {account.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(account)}
                    style={[styles.deleteBtn, { backgroundColor: palette.danger.base }]}
                  >
                    <FontAwesome name="trash" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </ScrollView>
        )}
      </AuthCardBody>
    </>
  )
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  list: {
    maxHeight: 320,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
})
