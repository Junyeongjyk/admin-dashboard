import React, { ChangeEvent } from 'react';
import { ToggleStatus } from 'src/types/enum/ethEnum';
import { Gender, SignupType } from 'src/types/enum/userEnum';
import './Setting.scss';

export interface UserInformation {
  email?: string;
  isEmailVerified?: boolean;
  phone?: string;
  [key: string]: any;
}

export interface UserProfileFormProps {
  userType?: SignupType;
  userInfomation?: UserInformation | null;

  username: string;

  newEmail: string;
  setNewEmail: (val: string) => void;
  emailCodeSent: boolean;
  emailAuthValie: boolean;
  emailExpired: boolean;
  emailTimer: number;
  emailError?: string;
  emailCode: string;
  setEmailCode: (val: string) => void;

  address: string;
  zipcode: string;
  codeSent?: boolean;
  detailAddress: string;
  setDetailAddress: (val: string) => void;
  postOn: boolean;

  newPhone: string;
  setNewPhone: (val: string) => void;
  phoneCodeSent: boolean;
  phoneAuthValie: boolean;
  phoneExpired: boolean;
  phoneTimer: number;
  phoneError?: string;
  phoneCode: string;
  setPhoneCode: (val: string) => void;

  alarmMode: ToggleStatus;
  twoFactorMode: ToggleStatus;

  gender: string;
  setGender: (val: string) => void;

  sendEmailCode: () => void;
  verifyEmailCode: () => void;
  openPostcode: () => void;

  sendCode: () => void;
  verifyCode: () => void;

  toggleAlarm: () => void;
  toggleTwoFactor: () => void;

  handleUpdate: () => void;
  handleWithdraw: () => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userType,
  userInfomation,
  username,
  newEmail,
  setNewEmail,
  emailCodeSent,
  emailAuthValie,
  emailExpired,
  emailTimer,
  emailError,
  emailCode,
  setEmailCode,
  address,
  zipcode,
  codeSent,
  detailAddress,
  setDetailAddress,
  postOn,
  newPhone,
  setNewPhone,
  phoneCodeSent,
  phoneAuthValie,
  phoneExpired,
  phoneTimer,
  phoneError,
  phoneCode,
  setPhoneCode,
  alarmMode,
  twoFactorMode,
  gender,
  setGender,
  sendEmailCode,
  verifyEmailCode,
  openPostcode,
  sendCode,
  verifyCode,
  toggleAlarm,
  toggleTwoFactor,
  handleUpdate,
  handleWithdraw,
}) => {
  return (
    <div className="detail-mypage content">
      {/* 이름 */}
      <div className="input-group">
        <p>
          이름 <b></b>
        </p>
        <div className="input-group__input">
          <input placeholder="이름" value={username || ''} disabled readOnly />
        </div>
      </div>

      {/* 이메일 */}
      <div className="input-group">
        <p>
          이메일 <b>*</b>
        </p>
        {userInfomation?.email && (
          <p className="opacity">현재 : {userInfomation.email}</p>
        )}
        <div className="input-group__input">
          <input
            placeholder="입력해주세요"
            value={newEmail || ''}
            disabled={emailCodeSent}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewEmail(e.target.value)
            }
          />
          {emailCodeSent ? (
            !emailAuthValie && (
              <div className="timer">
                남은 시간: {Math.floor(emailTimer / 60)}:
                {String(emailTimer % 60).padStart(2, '0')}
              </div>
            )
          ) : emailExpired ? (
            <p className="timer red">시간이 만료되었습니다. 재발송해주세요.</p>
          ) : null}

          {userInfomation &&
            (userInfomation.email !== newEmail ||
              !userInfomation.isEmailVerified) && (
              {!emailAuthValie && (
                <button
                  className="check"
                  type="button"
                  onClick={sendEmailCode}
                  disabled={codeSent}
                >
                  {emailCodeSent ? '재발송' : '인증번호 발송'}
                </button>
              )}
            )}
        </div>

        {emailError && <p className="input-error">{emailError}</p>}

        {emailCodeSent && (
          <>
            <div className="sign__body__flow__group">
              <input
                type="text"
                className="margin-top-7"
                placeholder="인증번호 6자리"
                value={emailCode || ''}
                disabled={emailAuthValie}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmailCode(e.target.value)
                }
              />
              <button
                className="check confirm"
                type="button"
                onClick={verifyEmailCode}
                disabled={emailAuthValie}
              >
                인증 확인
              </button>
            </div>
            {emailAuthValie && (
              <p className={`password ${emailAuthValie ? 'valid' : ''}`}>
                <img src="/assets/images/icon/password.svg" alt="password icon" />
                <span>인증완료 되었습니다.</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* 주소 */}
      <div className="input-group">
        <p>
          주소 <b>*</b>
        </p>
        <div className="input-group__input">
          <input
            type="text"
            placeholder="기본 주소"
            value={address || ''}
            readOnly
          />
          <button
            className="check"
            type="button"
            onClick={openPostcode}
            disabled={postOn}
          >
            주소검색
          </button>
        </div>
        <div className="input-group__adress">
          <input
            type="text"
            className="zonecode"
            placeholder="우편번호"
            value={zipcode || ''}
            readOnly
          />
          <input
            type="text"
            className="detail"
            placeholder="상세주소"
            value={detailAddress || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDetailAddress(e.target.value)
            }
          />
        </div>
      </div>

      {/* 휴대폰 번호 */}
      <div className="input-group">
        <p>
          휴대폰 번호 <b>*</b>
        </p>
        {userInfomation?.phone && (
          <p className="opacity">현재 : {userInfomation.phone}</p>
        )}
        <div className="input-group__input">
          <input
            placeholder="휴대폰 번호 (- 없이 숫자만)"
            value={newPhone || ''}
            disabled={phoneCodeSent}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewPhone(e.target.value)
            }
          />
          {phoneCodeSent ? (
            !phoneAuthValie && (
              <div className="timer">
                남은 시간: {Math.floor(phoneTimer / 60)}:
                {String(phoneTimer % 60).padStart(2, '0')}
              </div>
            )
          ) : phoneExpired ? (
            <p className="timer red">시간이 만료되었습니다. 재발송해주세요.</p>
          ) : null}

          {userInfomation && userInfomation.phone !== newPhone && (
            {!phoneAuthValie && (
              <button
                className="check"
                type="button"
                onClick={sendCode}
                disabled={phoneCodeSent}
              >
                {phoneCodeSent ? '재발송' : '인증번호 발송'}
              </button>
            )}
          )}
        </div>

        {phoneError && <p className="input-error">{phoneError}</p>}

        {phoneCodeSent && (
          <>
            <div className="sign__body__flow__group">
              <input
                type="text"
                className="margin-top-7"
                placeholder="인증번호 6자리"
                value={phoneCode || ''}
                disabled={phoneAuthValie}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPhoneCode(e.target.value)
                }
              />
              <button
                className="check confirm"
                type="button"
                onClick={verifyCode}
                disabled={phoneAuthValie}
              >
                인증 확인
              </button>
            </div>
            {phoneAuthValie && (
              <p className={`password ${phoneAuthValie ? 'valid' : ''}`}>
                <img src="/assets/images/icon/password.svg" alt="password icon" />
                <span>인증완료 되었습니다.</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* 성별 */}
      <div className="input-group">
        <p>
          성별 <b>*</b>
        </p>
        <div className="gender-buttons">
          <button
            type="button"
            className={gender === Gender.MALE ? 'active' : ''}
            onClick={() => setGender(Gender.MALE)}
          >
            남성
          </button>

          <button
            type="button"
            className={gender === Gender.FEMALE ? 'active' : ''}
            onClick={() => setGender(Gender.FEMALE)}
          >
            여성
          </button>
        </div>
      </div>

      {/* 토글 알림 및 2단계 인증 */}
      <div className="input-group flex">
        <div>
          <p>
            알림설정 <b>*</b>
          </p>
          <div className="header__icons margin-top-10">
            <div
              className={`alarm-mode ${
                alarmMode === ToggleStatus.ON ? 'active' : ''
              }`}
              onClick={toggleAlarm}
            >
              <div className="alarm-mode__button"></div>
            </div>
          </div>
        </div>

        <div>
          <p>
            2단계인증설정 <b>*</b>
          </p>
          <div className="header__icons margin-top-10">
            <div
              className={`alarm-mode ${
                twoFactorMode === ToggleStatus.ON ? 'active' : ''
              }`}
              onClick={toggleTwoFactor}
            >
              <div className="alarm-mode__button"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="button-group">
        <button type="button" className="update" onClick={handleUpdate}>
          정보 수정
        </button>
        <button type="button" className="withdraw" onClick={handleWithdraw}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default UserProfileForm;