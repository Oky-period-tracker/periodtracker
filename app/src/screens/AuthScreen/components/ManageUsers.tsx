import React from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { AuthHeader } from './AuthHeader'
import { AuthCardBody } from './AuthCardBody'
import { Text } from '../../../components/Text'
import { listUsers } from '../../../services/userMetadata/registry'
import { RegisteredUser } from '../../../services/userMetadata/types'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'

export const ManageUsers = () => {
  const [accounts, setAccounts] = React.useState<RegisteredUser[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { color, palette } = useColor()
  const translate = useTranslate()

  const loadAccounts = React.useCallback(async () => {
    try {
      const list = await listUsers()
      setAccounts([...list].sort((a, b) => a.name.localeCompare(b.name)))
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  return (
    <>
      <AuthHeader title={'manage_users'} />
      <AuthCardBody>
        {isLoading ? (
          <ActivityIndicator color={palette.secondary.base} style={styles.loading} />
        ) : accounts.length === 0 ? (
          <Text style={styles.emptyText}>no_users</Text>
        ) : (
          <ScrollView style={styles.usersList} showsVerticalScrollIndicator={true}>
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
                  <FontAwesome
                    name={account.isPendingSync ? 'cloud-upload' : 'cloud'}
                    size={18}
                    color={account.isPendingSync ? palette.secondary.base : color}
                    style={styles.syncIcon}
                    accessibilityLabel={
                      account.isPendingSync ? translate('offline_account') : translate('synced_account')
                    }
                  />
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
  loading: {
    marginVertical: 20,
  },
  usersList: {
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
  syncIcon: {
    marginHorizontal: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
})
