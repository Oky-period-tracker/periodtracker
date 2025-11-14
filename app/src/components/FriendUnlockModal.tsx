import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { Modal, ModalProps } from './Modal'
import { Text } from './Text'
import { Button } from './Button'
import { getAsset } from '../services/asset'
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface FriendUnlockModalProps extends ModalProps {
  onCreateFriend: () => void
}

export const FriendUnlockModal = ({
  visible,
  toggleVisible,
  onCreateFriend,
}: FriendUnlockModalProps) => {
  const handleCreateFriend = () => {
    toggleVisible()
    onCreateFriend()
  }

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={toggleVisible} style={styles.closeButton}>
          <FontAwesome name="close" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Hooray! All 3 locks are open – make your very own Oky friend, just the way you like!
        </Text>
        
        <View style={styles.iconContainer}>
          <Image 
            source={getAsset('gifs.friendUnlock')} 
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        
        <TouchableOpacity 
          onPress={handleCreateFriend} 
          style={[styles.createButton, { backgroundColor: '#FF9800' }]}
        >
          <Text style={styles.buttonText} enableTranslate={false}>Create your friend</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10000,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    width: 'auto',
    height: 'auto',
    minHeight: 50,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

