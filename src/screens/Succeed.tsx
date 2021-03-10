import { useHistory } from "react-router-dom";
import { Firebase } from "../utils";
import "./App.css";

const NotFoundPage = () => {
  const history = useHistory();

  Firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      history.push("/");
    }
  });

  const joinChatRoom = async () => {
    window.open("https://go.hdml.kr/interview2021");
  };

  const signOut = async () => {
    Firebase.auth().signOut();
  };

  return (
    <div className="warp py-5">
      <h1 className="title fw-bold">예약했습니다.</h1>
      <div className="mt-3">
        <p>
          오픈 채팅방에 들어와 있지 않으시다면, 본인의 학번과 이름으로 꼭
          들어와주세요.{"\n"}
          오픈 채팅방에서 면접 세부사항을 안내합니다.
        </p>
      </div>
      <button
        className="btn btn-dark btn-lg btn-primary btn-block mt-4"
        type="button"
        id="submitButton"
        onClick={joinChatRoom}
      >
        오픈채팅방 들어가기
      </button>
      <button
        className="btn btn-block mt-2"
        type="button"
        id="signOutButton"
        onClick={signOut}
      >
        이용 종료하기
      </button>
    </div>
  );
};

export default NotFoundPage;
