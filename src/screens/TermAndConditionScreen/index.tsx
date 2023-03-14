import { ScrollView, View } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import Text from '../../components/Text/Text';
import Checkbox from '../../components/Checkbox/Checkbox';
import Button from '../../components/Button/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}
export default function TermAndConditionScreen({
  navigation,
}: Props): JSX.Element {
  const [disabledCheckbox, setDisabledCheckbox] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <Container>
      <Header title="เงื่อนไขการใช้งาน" />
      <Content
        style={{
          paddingTop: 0,
        }}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              setDisabledCheckbox(false);
            }
          }}>
          <View
            style={{
              marginTop: 16,
            }}>
            <Text semiBold fontSize={18} fontFamily="NotoSans">
              ข้อตกลงและเงื่อนไข
            </Text>
            <Text
              fontFamily="NotoSans"
              style={{
                marginTop: 8,
              }}>
              โปรดอ่านข้อตกลงและเงื่อนไขโดยละเอียดก่อน ดำเนินการถัดไป
            </Text>
          </View>
          <View
            style={{
              marginVertical: 24,
            }}>
            <Text bold fontSize={24} fontFamily="NotoSans">
              เงื่อนไขการใช้งาน
            </Text>
          </View>
          <Text
            style={{
              marginVertical: 8,
            }}>
            หัวข้อนโยบาย
          </Text>
          <View
            style={{
              paddingBottom: 24,
            }}>
            <Text color="text3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptatem voluptas laborum, obcaecati tempore ab, expedita
              commodi id quas nisi dicta nulla facilis magnam blanditiis vero ad
              illum molestiae consequuntur quos sequi repellat deserunt suscipit
              nobis, cumque ratione. Tempora iste mollitia ea temporibus aperiam
              doloremque nihil ipsum alias praesentium rerum. Nobis quam omnis
              id vero quod. Impedit, rem voluptatum eius a necessitatibus
              ducimus placeat alias est iure beatae quas, tenetur nulla quo.
              Omnis assumenda veniam fuga facere commodi eveniet nulla cum,
              laboriosam voluptate dolore dignissimos doloremque nostrum quasi
              autem atque. Delectus assumenda in quisquam exercitationem
              voluptates rerum, aliquam illo odit perferendis doloribus
              voluptate vero. Praesentium at, voluptates quas cum quibusdam
              dolorum non itaque ducimus soluta doloremque quae maiores expedita
              ratione repellendus reprehenderit officiis! Vel id reiciendis,
              veniam pariatur quidem ab, sequi ipsam omnis consectetur dolor
              obcaecati, consequatur assumenda voluptatibus. Molestias,
              quibusdam commodi cum, dolores nam deleniti porro, modi quisquam
              cupiditate ut repellat est! Nemo deserunt fugit accusantium error
              atque tenetur eligendi ea dolorem quidem, perspiciatis enim,
              doloribus, aliquam rerum consectetur. Velit, reiciendis nobis
              assumenda repellat magnam hic, facere adipisci minus rerum
              corporis, officiis veniam. Possimus minus praesentium nobis
              molestias natus voluptas, beatae provident voluptatum sed
              accusamus consequatur, fugiat recusandae autem cupiditate nostrum
              incidunt nihil rerum aliquam obcaecati blanditiis quos at. Nemo
              tempora deserunt, doloremque accusantium vel, natus corrupti
              asperiores similique cumque aspernatur molestiae voluptates sequi!
              Fugit molestias laudantium minus nemo sed, neque sunt ad nobis!
              Architecto cupiditate expedita eaque soluta quaerat molestias
              facilis error vero ab ducimus quae aperiam, voluptatem corporis?
              Libero, recusandae nostrum, exercitationem ex id accusantium
              ducimus, reiciendis corporis at commodi in soluta quaerat est
              perferendis facere quas quod nisi veniam reprehenderit minima nam
              voluptate. Et ipsa optio ipsum praesentium, officia eum odio, id
              perferendis pariatur hic sunt laudantium incidunt vitae cumque
              iure ab facere commodi dicta mollitia corrupti dignissimos omnis
              nostrum atque. Natus voluptatem cum architecto eos nostrum
              sapiente sint, odio quaerat adipisci. Voluptatem tenetur
              accusantium nemo aliquam maxime vel odio neque quam repudiandae ad
              exercitationem quaerat dignissimos qui magnam ratione consequuntur
              iusto quos cum commodi obcaecati, impedit quibusdam sed. Deserunt
              in, numquam laudantium esse voluptatem possimus libero odio, minus
              ut delectus accusantium iure neque rem aliquam hic repellendus
              commodi quos porro similique vero. Quasi officia ratione culpa
              atque corporis sequi quis hic placeat itaque sunt, voluptas esse,
              blanditiis voluptatem quibusdam, quos et quidem neque corrupti
              veritatis. Maiores nobis magnam, id molestiae accusantium
              consequatur nisi quas accusamus beatae mollitia, culpa pariatur
              fugit quae adipisci repellendus eveniet voluptatem iusto ex dolore
              veniam blanditiis ipsa. Vitae deleniti commodi consequuntur vel
              provident doloribus est, nam magni iure tempore perferendis dicta
              a soluta officiis quisquam minima ipsam accusamus aliquam ipsum
              similique reiciendis aliquid cupiditate dolorum molestiae.
              Laudantium, aspernatur! Ipsum ipsa deserunt dignissimos similique
              consequuntur voluptates alias eos aperiam impedit saepe vero
              ipsam, autem tenetur accusantium voluptatum fugiat recusandae ea
              reprehenderit possimus aspernatur consequatur expedita velit
              dolore! Vero aliquid quis placeat expedita deleniti blanditiis
              temporibus facilis ratione alias laboriosam a ab molestias magnam,
              dolores ex quisquam? Iste mollitia illo dolore ea, dicta rerum?
            </Text>
          </View>
        </ScrollView>
        <View
          style={{
            minHeight: 100,
            paddingVertical: 24,
          }}>
          <Checkbox
            disabled={disabledCheckbox}
            onPress={() => {
              setChecked(!checked);
            }}
            valueCheckbox={checked ? ['accept'] : []}
            listCheckbox={[
              {
                title: 'ฉันยอมรับข้อมตกลงและเงื่อนไข',
                value: 'accept',
                key: 'accept',
              },
            ]}
          />
          <Button
            onPress={async () => {
              await AsyncStorage.setItem('alreadyAcceptTerm', 'false');
              navigation.navigate('LoginSuccessScreen');
            }}
            disabled={!checked}
            title="ยอมรับ"
            style={{
              marginTop: 16,
            }}
          />
        </View>
      </Content>
    </Container>
  );
}
