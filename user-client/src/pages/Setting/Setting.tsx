import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { popup, popupAsync } from 'utils/popup';
import { deleteCookie, getAccessToken, got } from 'utils/helper';
import { ApiPath } from "src/types/enum/apiEnum";
import { validateAuthCode, validatePhoneNumber, validateEmail, validateStringBasic, validatePassword } from "src/utils/validate";
import { createKey, encrypt, getDecryptData } from "src/utils/aes.utils";
import type { UserInfo } from 'src/types/user.type';
import { SignupType } from 'src/types/enum/userEnum';
import { SettingType, ToggleStatus } from 'src/types/enum/ethEnum';
import PostcodeEmbed from 'src/utils/PostcodeEmbed';
import PartnerProfile from './import/PartnerProfile';
import Profile from './import/Profile';
import { useUserStore } from 'src/stores/userStore';
import "./Setting.scss";

interface SettingPageProps {
  type: SettingType;
}

export const SettingPage: React.FC<SettingPageProps> = ({ type }) => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, setHasCookie } = useUserStore();

  // Form States
  const [username, setUsername] = useState<string>('');
  const [identity, setIdentity] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [userIdentityCheck, setUserIdentityCheck] = useState<boolean>(false);
  const [alarmMode, setAlarmMode] = useState<ToggleStatus>(ToggleStatus.OFF);
  const [twoFactorMode, setTwoFactorMode] = useState<ToggleStatus>(ToggleStatus.OFF);

  const [clientType, setClientType] = useState<string>(SignupType.USER);

  // Validation & Error States
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [identityError, setIdentityError] = useState<string>('');
  const [authCodeError, setAuthCodeError] = useState<string>('');

  // Verification & Timer States
  const [emailCodeSent, setEmailCodeSent] = useState<boolean>(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState<boolean>(false);
  const [emailTimer, setEmailTimer] = useState<number>(180);
  const [phoneTimer, setPhoneTimer] = useState<number>(180);
  const [emailExpired, setEmailExpired] = useState<boolean>(false);
  const [phoneExpired, setPhoneExpired] = useState<boolean>(false);

  const emailIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const phoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Address States
  const [address, setAddress] = useState<string>('');
  const [showPostcode, setShowPostcode] = useState<boolean>(false);
  const [postOn, setPostOn] = useState<boolean>(false);
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');

  const [codeSent, setCodeSent] = useState<boolean>(false);

  const [phoneCode, setPhoneCode] = useState<string>('');
  const [emailCode, setEmailCode] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phoneAuthValie, setPhoneAuthValie] = useState<boolean>(false);
  const [emailAuthValie, setEmailAuthValie] = useState<boolean>(false);

  const [usersInformation, setUsersInformation] = useState<UserInfo>({} as UserInfo);

  // Timer Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);
      if (phoneIntervalRef.current) clearInterval(phoneIntervalRef.current);
    };
  }, []);

  const startEmailTimer = () => {
    setEmailTimer(180);
    setEmailExpired(false);
    if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);

    emailIntervalRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);
          setEmailCodeSent(false);
          setEmailExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPhoneTimer = () => {
    setPhoneTimer(180);
    setPhoneExpired(false);
    if (phoneIntervalRef.current) clearInterval(phoneIntervalRef.current);

    phoneIntervalRef.current = setInterval(() => {
      setPhoneTimer((prev) => {
        if (prev <= 1) {
          if (phoneIntervalRef.current) clearInterval(phoneIntervalRef.current);
          setPhoneCodeSent(false);
          setPhoneExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendEmailCode = async () => {
    setEmailError('');

    const check = validateEmail(newEmail);
    if (!check.ok) {
      setEmailError(check.message);
      return;
    }

    const key = await createKey();
    const param = {
      email: await encrypt(key, newEmail)
    };

    const response = await got(ApiPath.VERIFY_EMAIL, 'POST', param, await getAccessToken(ApiPath.VERIFY_EMAIL));

    if (response.status === 1) {
      setEmailCodeSent(true);
      setEmailCode(response.data);
      setUsersInformation((prev) => ({ ...prev, isEmailVerified: false }));
      startEmailTimer();
    } else {
      setEmailError(response.message);
    }
  };

  const sendCode = async () => {
    setPhoneError('');

    const check = validatePhoneNumber(newPhone);
    if (!check.ok) {
      setPhoneError(check.message);
      return;
    }

    const key = await createKey();
    const param = {
      phoneNumber: await encrypt(key, newPhone)
    };

    const response = await got(ApiPath.VERIFY_PHONE, 'POST', param);

    if (response.status === 1) {
      setPhoneCodeSent(true);
      setPhoneCode(response.data);
      startPhoneTimer();
    } else {
      setPhoneError(response.message);
    }
  };

  const verifyCode = async () => {
    setAuthCodeError('');

    const check = validateAuthCode(phoneCode);
    if (!check.ok) {
      setAuthCodeError(check.message);
      return;
    }

    const key = await createKey();
    const param = {
      phoneNumber: await encrypt(key, newPhone),
      code: await encrypt(key, phoneCode)
    };

    const response = await got(ApiPath.CONFIRM_PHONE, 'POST', param);
    if (response.status === 1) {
      setPhoneAuthValie(true);
      if (phoneIntervalRef.current) clearInterval(phoneIntervalRef.current);
    } else {
      setAuthCodeError(response.message);
    }
  };

  const verifyEmailCode = async () => {
    setEmailError('');

    const check = validateAuthCode(emailCode);
    if (!check.ok) {
      setEmailError(check.message);
      return;
    }

    const key = await createKey();
    const param = {
      email: await encrypt(key, newEmail),
      code: await encrypt(key, emailCode)
    };

    const response = await got(ApiPath.CONFIRM_EMAIL, 'POST', param, await getAccessToken(ApiPath.CONFIRM_EMAIL));
    if (response.status === 1) {
      setEmailAuthValie(true);
      setUsersInformation((prev) => ({ ...prev, isEmailVerified: true }));
      if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);
    } else {
      setEmailError(response.message);
    }
  };

  const openPostcode = async () => {
    if (postOn) return;

    setPostOn(true);
    setShowPostcode(true);
  };

  const handleUpdate = async () => {
    let params: any;
    const key = await createKey();

    if (type === SettingType.PROFILE) {
      const checkEmail = validateEmail(newEmail);
      if (!checkEmail.ok) {
        setEmailError(checkEmail.message);
        return;
      }

      if (!usersInformation.isEmailVerified) {
        setEmailError('이메일 인증을 해주세요');
        return;
      }

      if (usersInformation.email !== newEmail) {
        if (!emailAuthValie) {
          setEmailError('이메일 인증을 해주세요');
          return;
        }
      }

      const checkPhone = validatePhoneNumber(newPhone);
      if (!checkPhone.ok) {
        setPhoneError(checkPhone.message);
        return;
      }

      if (usersInformation.phone !== newPhone) {
        if (!phoneAuthValie) {
          setPhoneError('휴대폰 번호 인증을 해주세요');
          return;
        }
      }

      params = {
        email: await encrypt(key, newEmail),
        address: await encrypt(key, address),
        zipCode: await encrypt(key, zipcode),
        phone: await encrypt(key, newPhone),
        detailAddress: detailAddress,
        gender: gender,
        notification: alarmMode === ToggleStatus.ON,
        twoFactor: twoFactorMode === ToggleStatus.ON
      };

    } else if (type === SettingType.PASSWORD) {
      setIdentityError('');
      let checkIdentity = validateStringBasic(identity, '아이디');
      if (!checkIdentity.ok) {
        setIdentityError(checkIdentity.message);
        return;
      }

      checkIdentity = validateEmail(identity);
      if (!checkIdentity.ok) {
        setIdentityError(checkIdentity.message);
        return;
      }

      if (usersInformation.identity !== identity && !userIdentityCheck) {
        setIdentityError('아이디 중복검사를 해주세요');
        return;
      }

      const checkPw = validatePassword(password);
      if (!checkPw.ok) {
        setPasswordError(checkPw.message);
        return;
      }

      if (password || passwordConfirm) {
        if (password !== passwordConfirm) {
          setPasswordError('비밀번호가 일치하지 않습니다.');
          return;
        }
      }

      params = {
        identity: await encrypt(key, identity),
        password: await encrypt(key, password)
      };

    } else {
      return;
    }

    const targetApiPath = type === SettingType.PROFILE ? ApiPath.USER_INFO : ApiPath.USER_PASSWORD;
    const response = await got(targetApiPath, 'PATCH', params, await getAccessToken(targetApiPath));

    if (response.status === 1) {
      popup('수정되었습니다.');
      navigate('/setting');
    } else {
      popup(response.message);
    }
  };

  const handleWithdraw = async () => {
    const result = await popupAsync("회원탈퇴 하시겠습니까?", 3);
    if (!result) return;

    const deviceId = userInfo?.clientId?.replace(/^USER-\d+-/, "");
    const params = { deviceId };

    const response = await got(ApiPath.USER_INFO, 'DELETE', params, await getAccessToken(ApiPath.USER_INFO));
    if (response.status === 1) {
      deleteCookie('myInfo');
      setUserInfo(null);
      if (setHasCookie) setHasCookie(false);
      navigate("/", { replace: false });
      window.location.reload();
    } else {
      popup(response.message);
    }
  };

  const handCheckIdentity = async () => {
    const check = validateEmail(identity);
    if (!check.ok) {
      setIdentityError(check.message);
      return;
    }

    const key = await createKey();
    const params = {
      identity: await encrypt(key, identity)
    };

    const response = await got(ApiPath.CHECK_IDENTITY, "POST", params);
    if (response.status === 1) {
      popup('사용 할수있는 아이디입니다.');
      setUserIdentityCheck(true);
      return;
    } else {
      setIdentityError('사용 할 수 없는 아이디입니다.');
      return;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.replace(/\s+/g, ''));
  };

  const toggleAlarm = () => {
    setAlarmMode((prev) => (prev === ToggleStatus.ON ? ToggleStatus.OFF : ToggleStatus.ON));
  };

  const toggleTwoFactor = () => {
    setTwoFactorMode((prev) => (prev === ToggleStatus.ON ? ToggleStatus.OFF : ToggleStatus.ON));
  };

  const handleGetInfo = async () => {
    const response = await got(ApiPath.USER_INFO, 'POST', {}, await getAccessToken(ApiPath.USER_INFO));
    if (response.status === 1) {
      const data: UserInfo = response.data;

      data.identity = await getDecryptData(data.identity);
      data.name = await getDecryptData(data.name);
      data.email = await getDecryptData(data.email);
      data.address = await getDecryptData(data.address);
      data.zipcode = await getDecryptData(data.zipcode);
      data.phone = await getDecryptData(data.phone);

      setUsersInformation(data);

      setIdentity(data.identity);
      setUsername(data.name);
      setClientType(data.userType);
      setNewEmail(data.email);
      setAddress(data.address);
      setDetailAddress(data.detailAddress);
      setZipcode(data.zipcode);
      setNewPhone(data.phone);
      setGender(data.gender);

      setAlarmMode(data.isNotificationAgreed ? ToggleStatus.ON : ToggleStatus.OFF);
      setTwoFactorMode(data.isTwoFactorEnabled ? ToggleStatus.ON : ToggleStatus.OFF);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <>
      <div className="detail-mypage content">
        {type === SettingType.SETTING && (
          <>
            <h2>설정</h2>
            {clientType === SignupType.PARTNER && (
              <button type="button" className="mypage__button" onClick={() => navigate("/setting/partner/profile")}>
                <div>
                  <p>프로필 변경</p>
                  <p className="grey">파트너 프로필 변경</p>
                </div>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}
            <button type="button" className="mypage__button" onClick={() => navigate("/setting/profile")}>
              <div>
                <p>기본정보 변경</p>
                <p className="grey">닉네임, 이메일, 주소, 휴대폰 번호, 알림설정</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button type="button" className="mypage__button" onClick={() => navigate("/setting/password")}>
              <div>비밀번호 변경</div>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </>
        )}

        {type === SettingType.PASSWORD && (
          <>
            <div className="input-group">
              <p>아이디</p>
              {usersInformation && usersInformation.identity ? (
                <input value={identity} placeholder={identity} disabled />
              ) : (
                <div className="input-group__input">
                  <input
                    placeholder="아이디를 입력해주세요"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    disabled={userIdentityCheck}
                  />
                  {!userIdentityCheck && (
                    <button type="button" className="check" onClick={handCheckIdentity}>
                      중복확인
                    </button>
                  )}
                </div>
              )}
              {identityError && <p className="error-message">{identityError}</p>}
            </div>
            <div className="input-group">
              <p>비밀번호 <b>*</b></p>
              <input
                type="password"
                placeholder="새 비밀번호 (변경 시에만 입력)"
                value={password}
                onChange={handlePasswordChange}
              />
              <input
                className="margin-top-10"
                type="password"
                placeholder="새 비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
            <div className="button-group">
              <button type="button" className="update" onClick={handleUpdate}>
                비밀번호 변경
              </button>
            </div>
          </>
        )}

        {type === SettingType.PROFILE && (
          <Profile
            clientType={clientType}
            userInfomation={usersInformation}
            username={username}
            setUsername={setUsername}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            emailCodeSent={emailCodeSent}
            emailAuthValie={emailAuthValie}
            emailExpired={emailExpired}
            emailTimer={emailTimer}
            emailError={emailError}
            emailCode={emailCode}
            setEmailCode={setEmailCode}
            address={address}
            setAddress={setAddress}
            zipcode={zipcode}
            setZipcode={setZipcode}
            detailAddress={detailAddress}
            setDetailAddress={setDetailAddress}
            codeSent={codeSent}
            setCodeSent={setCodeSent}
            postOn={postOn}
            newPhone={newPhone}
            setNewPhone={setNewPhone}
            phoneCodeSent={phoneCodeSent}
            phoneAuthValie={phoneAuthValie}
            phoneExpired={phoneExpired}
            phoneTimer={phoneTimer}
            phoneError={phoneError}
            phoneCode={phoneCode}
            setPhoneCode={setPhoneCode}
            alarmMode={alarmMode}
            twoFactorMode={twoFactorMode}
            sendEmailCode={sendEmailCode}
            verifyEmailCode={verifyEmailCode}
            openPostcode={openPostcode}
            sendCode={sendCode}
            verifyCode={verifyCode}
            toggleAlarm={toggleAlarm}
            toggleTwoFactor={toggleTwoFactor}
            handleUpdate={handleUpdate}
            handleWithdraw={handleWithdraw}
            gender={gender}
            setGender={setGender}
          />
        )}

        {type === SettingType.PARTNER_PROFILE && <PartnerProfile />}
      </div>

      {showPostcode && (
        <PostcodeEmbed
          onSelect={(data: any) => {
            let selectedAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

            if (data.userSelectedType === 'R' && data.buildingName) {
              selectedAddress += ` (${data.buildingName})`;
            }

            setAddress(selectedAddress);
            setZipcode(data.zonecode);
            setShowPostcode(false);
            setPostOn(false);
          }}
          onClose={() => {
            setShowPostcode(false);
            setPostOn(false);
          }}
        />
      )}
    </>
  );
};

export default SettingPage;