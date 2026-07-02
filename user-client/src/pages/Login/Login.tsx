import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createKey, encrypt, getDecryptData } from "src/utils/aes.utils";
import { createDeviceId, getCookie, setCookie, got } from "src/utils/helper";
import { ApiPath } from "src/types/enum/apiEnum";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(1);
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

    </div>
  );
}

<style lang="scss">
  import "./Login.scss";
</style>