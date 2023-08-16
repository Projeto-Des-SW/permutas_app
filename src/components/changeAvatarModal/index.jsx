import * as S from './styles'
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { View } from 'react-native';

const modal = ({
    setAvatarFile,
    isOpen,
    setIsOpen
  }) => {
    async function showImagePicker(){
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
    
        if(result.assets[0].uri){
            setAvatarFile(result.assets[0].uri)
        }

        setIsOpen(false)
    }

    async function openCamera(){
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            return;
        }
    
        const result = await ImagePicker.launchCameraAsync();
    
        console.log(result.assets[0].uri)
        if(result.assets[0].uri){
            setAvatarFile(result.assets[0].uri)
        }

        setIsOpen(false)
    }

    return (
            <Modal
                backdropOpacity={0.8}
                backdropColor='#1C1D29'
                onBackdropPress={() => setIsOpen(false)}
                isVisible={isOpen}
            >
                <S.ModalView>
                    <S.Button
                        activeOpacity={0.5}
                        onPress={showImagePicker}>
                        <S.Text>Selecionar Imagem</S.Text>
                    </S.Button>

                    <S.Button
                        activeOpacity={0.5}
                        onPress={openCamera}>
                        <S.Text>Câmera</S.Text>
                    </S.Button>
                </S.ModalView>
            </Modal>
    )
}

export default modal;