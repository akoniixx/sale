import { Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import DashedLine from "react-native-dashed-line"
import { colors } from "../../assets/colors/colors"
import Button from "../Button/Button"
import Text from "../Text/Text"
import images from "../../assets/images"
import { getNewPath } from "../../utils/function"
import { DataForOrderLoad } from "../../entities/orderLoadTypes"
import { useNavigation } from "@react-navigation/native"

interface props {


    setModalOnBack: (value: boolean) => void
    modalOnback: boolean
    onSubmit: () => void
    onBack: () => void
}

export const ModalOnBack = ({


    setModalOnBack,
    modalOnback,
    onSubmit,
    onBack
}: props) => {

   
    const navigation = useNavigation();
    return (
        <Modal
            animationType="fade"
            onRequestClose={() => setModalOnBack(false)}
            visible={modalOnback}
            transparent>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                }}>
                <View style={[styles.modalView]}>
                    <View
                        style={{
                            paddingTop: 26,
                            paddingHorizontal: 56,

                        }}>
                        <Text semiBold lineHeight={30} center>
                            {` ต้องการบันทึกข้อมูล\nและออกจากหน้าใช่หรือไม่?`}
                        </Text>
                    </View>
                
                    <View style={{paddingVertical:10}}>
                    <DashedLine
                            dashGap={0}
                            dashThickness={0.5}
                            dashColor={colors.border2}
                            style={{marginBottom:10,marginTop:10}}
                        />
                    <TouchableOpacity
                            onPress={onSubmit}
                            style={{

                                justifyContent: 'center',
                            }}>
                            <Text color='primary' semiBold fontSize={14} fontFamily="NotoSans" center>
                                บันทึกและออก
                            </Text>
                        </TouchableOpacity>
                        <DashedLine
                            dashGap={0}
                            dashThickness={0.5}
                            dashColor={colors.border2}
                            style={{marginBottom:10,marginTop:10}}
                        />
                        <TouchableOpacity
                            onPress={()=>onBack()}
                            style={{
                                justifyContent: 'center',
                            }}>
                            <Text color='error' semiBold fontSize={14} fontFamily="NotoSans" center>
                                ไม่บันทึกและออก
                            </Text>
                        </TouchableOpacity>
                        <DashedLine
                            dashGap={0}
                            dashThickness={0.5}
                            dashColor={colors.border2}
                            style={{marginBottom:10,marginTop:10}}
                        />
                       
                        <TouchableOpacity
                            onPress={() => setModalOnBack(false)}
                            style={{

                                justifyContent: 'center',

                            }}>
                            <Text
                                semiBold
                                center
                                fontSize={14}
                                fontFamily="NotoSans"
                            >
                                ยกเลิก
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },


});