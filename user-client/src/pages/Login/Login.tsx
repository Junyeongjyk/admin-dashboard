import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createKey, encrypt, getDecryptData } from "src/utils/aes.utils";
import { createDeviceId, getCookie, setCookie, got } from "src/utils/helpers";
import { ApiPath } from "src/types/enum/apiEnum";
import "./Login.scss";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(1);

  const [twoFactorPhone, setTwoFactorPhone] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorCodeSent, setTwoFactorCodeSent] = useState(false);

  const uuid = getCookie("fcm_token");

  // 기본 로그인
  const basicLogin = async () => {
    try {
      const key = await createKey();

      const params = {
        identity: await encrypt(key, email),
        password: await encrypt(key, password),
        provider: "NORMAL",
        uuid,
        deviceId: createDeviceId(),
      };

      const response = await got(ApiPath.LOGIN, "POST", params);

      if (response.status === 1) {
        // 2차 인증 필요
        if (response.data.isTwoFactorEnabled) {
          setPage(2);
          return;
        }

        // 로그인 성공
        const sessionData = {
          id: response.data.id,
          type: response.data.userType,
          name: await getDecryptData(response.data.name),
          clientId: await getDecryptData(response.data.clientId),
          username: await getDecryptData(response.data.username),
        };

        setCookie("myInfo", JSON.stringify(sessionData));
        navigate("/");
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2차 인증
  const sendTwoFactorCode = async () => {
    const key = await createKey();

    const params = {
      phoneNumber: await encrypt(key, twoFactorPhone),
    };

    const response = await got(ApiPath.VERIFY_PHONE, "POST", params);

    if (response.status === 1) {
      setTwoFactorCodeSent(true);
    } else {
      alert(response.message);
    }
  };

  //2차 인증 확인
  const verifyTwoFactorCode = async () => {
    const key = await createKey();

    const params = {
      phoneNumber: await encrypt(key, twoFactorPhone),
      code: await encrypt(key, twoFactorCode),
      identity: await encrypt(key, email),
      password: await encrypt(key, password),
      uuid,
      deviceId: createDeviceId(),
      provider: "NORMAL",
    };

    const response = await got(ApiPath.TWO_FA_CONFRIM, "POST", params);

    if (response.status === 1) {
      const sessionData = {
        id: response.data.id,
        type: response.data.userType,
        name: await getDecryptData(response.data.name),
        clientId: await getDecryptData(response.data.clientId),
        username: await getDecryptData(response.data.username),
      };

      setCookie("myInfo", JSON.stringify(sessionData));
      navigate("/");
      window.location.reload();
    } else {
      alert(response.message);
    }
  };

  return (
    <div>
      {page === 1 && (
        <>
          <h1>로그인</h1>

          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={basicLogin}>로그인</button>
        </>
      )}

      {page === 2 && (
        <>
          <h2>2차 인증</h2>

          <input
            type="text"
            placeholder="전화번호"
            value={twoFactorPhone}
            onChange={(e) => setTwoFactorPhone(e.target.value)}
          />

          <button onClick={sendTwoFactorCode}>
            인증번호 발송
          </button>

          {twoFactorCodeSent && (
            <>
              <input
                type="text"
                placeholder="인증번호"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
              />

              <button onClick={verifyTwoFactorCode}>
                인증 확인
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

<style lang="scss">
  import "./Login.scss";
</style>