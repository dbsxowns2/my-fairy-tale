import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
/**내 스케치북 리스트 컴포넌트 */
import axios from "axios";
import Slider from "react-slick";
import {
  MydraweritemContainer,
  MySketchbookimage,
  Container,
  TitleContainer,
  BeforeBtn,
  AfterBtn,
  ImgTitle,
  ImgP,
} from "components/mydrawer/MydrawerStyle";
//mui아이콘 중 방향 버튼 아이콘을 가져
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MySketchbookList = () => {
  // axios로 내 스케치북 데이터 불러오기

  const userSeq = useSelector((state) => state.user);

  useEffect(() => {
    const sketchBooks = async () => {
      await axios
        .get("https://j8b201.p.ssafy.io/api/members/sketch/list", {
          headers: {
            Authorization: userSeq.accessToken,
          },
        })
        .then((response) => {
          console.log(response.data.content);
          setDatas(response.data.content);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    sketchBooks();
  }, []);

  // 이전 버튼 스타일
  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <BeforeBtn className={className} onClick={onClick}>
        <KeyboardArrowLeftIcon
          sx={{
            color: "black",
            position: "absolute",
            top: "-100%",
            left: "-150%",
            fontSize: "200%",
          }}
        />
      </BeforeBtn>
    );
  };

  // 다음 버튼 스타일
  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <AfterBtn className={className} onClick={onClick}>
        <KeyboardArrowRightIcon
          sx={{
            color: "black",
            position: "absolute",
            top: "-100%",
            right: "-50%",
            fontSize: "200%",
          }}
        />
      </AfterBtn>
    );
  };

  // Slick Carousel 설정을 정의
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };

  // 내 스케치북 데이터
  const [datas, setDatas] = useState([]);

  // 스케치북 날짜를 한국 시간으로 바꿈
  const [dateString, setDateString] = useState("");

  return (
    <Container>
      <TitleContainer>내 스케치북</TitleContainer>
      {datas.length > 0 ? (
        <Slider {...settings}>
          {datas.map((data) => (
            <MydraweritemContainer>
              <MySketchbookimage src={data.sketchImgUrl} />
              <ImgP>
                {new Date(data.savedAt).toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                })}
              </ImgP>
            </MydraweritemContainer>
          ))}
        </Slider>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default MySketchbookList;