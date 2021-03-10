import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Auth, Firebase, SwalDefault } from "../utils";
import "./App.css";

interface IApplyPageProps extends RouteComponentProps {}

interface IApplyPageState {
  studentNumber: string;
  studentName: string;
  phoneNumber: string;
  submitButtonEnabled: boolean;
}

class ApplyPage extends React.Component<IApplyPageProps, IApplyPageState> {
  auth: Auth;
  uid: string;

  constructor(props: IApplyPageProps) {
    super(props);
    this.auth = new Auth();
    this.uid = "";
    this.state = {
      studentNumber: "",
      studentName: "",
      phoneNumber: "010-",
      submitButtonEnabled: false,
    };
  }

  componentDidMount = async () => {
    this.registerAuthStateChangeListener();
  };

  registerAuthStateChangeListener = () => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.props.history.push("/succeed");
      }
    });
  };

  handleInput = (
    event:
      | React.FormEvent<HTMLInputElement>
      | React.FormEvent<HTMLTextAreaElement>
  ) => {
    const input = event.target as HTMLTextAreaElement;
    let invalid: boolean = false;
    switch (input.id) {
      case "studentNumber":
        if (input.value.length <= 5) {
          input.classList.remove("is-invalid");
          this.setState({ studentNumber: input.value.replace(/[^0-9]/g, "") });
          if (/^[1-3]0[1-9][0-3][0-9]$/.test(input.value) === false) {
            input.classList.add("is-invalid");
            invalid = true;
          }
        }
        break;
      case "studentName":
        if (input.value.length <= 5) {
          input.classList.remove("is-invalid");
          this.setState({ studentName: input.value });
          if (/^([가-힣]){2,5}$/.test(input.value) === false) {
            input.classList.add("is-invalid");
            invalid = true;
          }
        }
        break;
      case "phoneNumber":
        let phoneNumberWithoutHyphen: string;
        let phoneNumber: string;

        phoneNumberWithoutHyphen = input.value.replace(/[^0-9]/g, "");

        if (phoneNumberWithoutHyphen.slice(0, 3) !== "010") {
          phoneNumberWithoutHyphen = "010";
        }

        if (phoneNumberWithoutHyphen.length < 8) {
          phoneNumber = `${phoneNumberWithoutHyphen.slice(
            0,
            3
          )}-${phoneNumberWithoutHyphen.slice(3, 7)}`;
        } else {
          phoneNumber = `${phoneNumberWithoutHyphen.slice(
            0,
            3
          )}-${phoneNumberWithoutHyphen.slice(
            3,
            7
          )}-${phoneNumberWithoutHyphen.slice(7, 11)}`;
        }

        if (phoneNumber.length !== 13) {
          invalid = true;
        }

        this.setState({
          phoneNumber: phoneNumber,
        });
        break;
    }
    const form = document.querySelector("form");
    if (form !== null) {
      this.setState({ submitButtonEnabled: form.checkValidity() && !invalid });
    }
  };

  submitForm = async () => {
    this.setState({ submitButtonEnabled: false });
    const user = await this.auth.auth(`+82 ${this.state.phoneNumber}`);
    if (user) {
      const form = Firebase.firestore()
        .collection("appointments")
        .doc(this.uid);
      try {
        await form.set({
          학번: parseInt(this.state.studentNumber),
          이름: this.state.studentName,
          전화번호: this.state.phoneNumber,
        });
      } catch (_) {
        Firebase.auth().signOut();
        await SwalDefault.fire({
          icon: "error",
          title: "제출할 수 없습니다.",
          text:
            "한 번 제출하셨던 경우 동일한 전화번호로 재 제출이 불가능합니다.",
        });
      }
    }
    this.setState({ submitButtonEnabled: true });
  };

  render() {
    return (
      <div className="warp py-5">
        <h1 className="title fw-bold">면접 예약하기</h1>
        <form>
          <div className="mt-3">
            <p>
              한 번 제출하면 수정할 수 없으니 정확한 학번과 이름을 남겨주세요.
              부정확한 정보로 인해 발생하는 모든 책임은 지원자에게 있습니다.
            </p>
            <div
              className="btn-group btn-group-toggle"
              data-toggle="buttons"
              id="selGroup"
              style={{ width: "100%" }}
            >
              <div className="input-group-append">
                <label className="input-group-text" htmlFor="btnGroup">
                  학번
                </label>
              </div>
              <input
                type="number"
                inputMode="numeric"
                id="studentNumber"
                className="form-control"
                placeholder="10101"
                required
                value={this.state.studentNumber}
                onInput={this.handleInput}
                style={{ padding: ".375rem .75rem" }}
              />
              <div className="input-group-append">
                <label className="input-group-text" htmlFor="btnGroup">
                  이름
                </label>
              </div>
              <input
                type="text"
                id="studentName"
                className="form-control p-auto"
                minLength={2}
                maxLength={5}
                placeholder="폰은정"
                required
                value={this.state.studentName}
                onInput={this.handleInput}
                style={{ padding: ".375rem .75rem" }}
              />
            </div>
            <div
              className="btn-group btn-group-toggle"
              data-toggle="buttons"
              id="selGroup"
              style={{ width: "100%" }}
            >
              <div className="input-group-append">
                <label className="input-group-text" htmlFor="btnGroup">
                  전화번호
                </label>
              </div>
              <input
                type="text"
                id="phoneNumber"
                className="form-control"
                value={this.state.phoneNumber}
                onInput={this.handleInput}
              />
            </div>
            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                onInput={this.handleInput}
                required
              ></input>
              <label
                className="form-check-label text-muted"
                htmlFor="flexCheckDefault"
              >
                <a
                  href="https://www.notion.so/c23f95d4dc6b49b1a4e0e64a496a3e36"
                  className="text-dark"
                  target="_blank"
                  rel="noreferrer"
                >
                  개인정보처리방침
                </a>
                에 동의합니다.
              </label>
            </div>
          </div>
        </form>
        <div className="text-muted mt-2">
          이 사이트는 reCAPTCHA로 보호받고 있으며 Google의{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-dark"
            target="_blank"
            rel="noreferrer"
          >
            개인정보처리방침
          </a>
          과{" "}
          <a
            href="https://policies.google.com/terms"
            className="text-dark"
            target="_blank"
            rel="noreferrer"
          >
            이용 약관
          </a>
          이 적용됩니다.
        </div>

        <button
          className="btn btn-dark btn-lg btn-primary btn-block mt-3"
          type="button"
          id="submitButton"
          onClick={this.submitForm}
          disabled={!this.state.submitButtonEnabled}
        >
          면접 예약하기
        </button>
      </div>
    );
  }
}

export default ApplyPage;
