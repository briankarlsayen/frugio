import React from 'react';
import {KeyboardAvoidingView, Modal, Pressable, StyleSheet} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';
import ThemedHr from './ThemedHr';
import CustomIconButton from './CustomIconButton';
import {MODAL_BG} from '@/constants/colors';

interface IDateFilterModal {
  open: boolean;
  handleClose: () => void;
  windowHeight: number;
  handleDelete: () => void;
}

export default function DateFilterModal({
  open,
  handleClose,
  windowHeight,
  handleDelete,
}: IDateFilterModal) {
  const handleCancel = () => {
    handleClose();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.keyboardContainer}>
        <ThemedView style={styles.overlay}>
          <ThemedView
            darkColor={MODAL_BG}
            style={[styles.bottomSheet, {height: windowHeight * 0.22}]}>
            <ThemedView darkColor={MODAL_BG} style={styles.headerContainer}>
              <ThemedText type="title" style={{textTransform: 'capitalize'}}>
                Delete
              </ThemedText>
              <CustomIconButton
                onPress={handleClose}
                name={'close'}
                size={30}
              />
            </ThemedView>
            <ThemedView style={styles.hrContainer}>
              <ThemedHr />
            </ThemedView>
            <ThemedText>Are you sure you want to delete this?</ThemedText>

            <ThemedView style={styles.confirmButtonContainer}>
              <Pressable
                onPress={handleCancel}
                android_ripple={{color: 'rgba(255,255,255,0.3)'}}
                style={({pressed}) => [
                  styles.button,
                  {backgroundColor: '#5a5c63'},

                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                android_ripple={{color: 'rgba(255,255,255,0.3)'}}
                style={({pressed}) => [
                  styles.button,
                  {backgroundColor: 'red'},

                  pressed && styles.buttonPressed,
                ]}>
                <ThemedText style={{padding: 2}}>Delete</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hrContainer: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flex: 0,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmButtonContainer: {
    width: '100%',
    paddingTop: 25,
    gap: 14,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
  button: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
