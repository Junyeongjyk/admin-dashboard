import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { popup } from 'utils/popup';
import { getAccessToken, got } from 'utils/helper';
import { ApiPath } from 'src/types/enum/apiEnum';
import PostcodeEmbed from 'src/utils/PostcodeEmbed';
import './Profile.scss';

export const PartnerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [id, setId] = useState<number>(0);

  // Form States
  const [nickname, setNickname] = useState<string>('');
  const [originalNickname, setOriginalNickname] = useState<string>('');

  // File & Image States
  const [profilePath, setProfilePath] = useState<string>('');
  const [profileFile, setProfileFile] = useState<File | null>(null);

  // UI States
  const [postOn, setPostOn] = useState<boolean>(false);
  const [showPostcode, setShowPostcode] = useState<boolean>(false);
  const [showBusinessDetail, setShowBusinessDetail] = useState<boolean>(true);

  // 파트너 정보 조회
  const handleGetPartnerInfo = async () => {
    const response = await got(
      ApiPath.Partner_INFO,
      'POST',
      {},
      await getAccessToken(ApiPath.Partner_INFO)
    );

    if (response.status === 1) {
      const data = response.data;
      setId(data.id);

      setNickname(data.nickname);
      setOriginalNickname(data.nickname);

    } else {
      popup(response.message);
    }
  };

  useEffect(() => {
    handleGetPartnerInfo();
  }, []);

  // 정보 수정 제출
  const handleUpdate = async () => {
    if (!nickname) {
      popup('닉네임을 입력해주세요');
      return;
    }

    const params = {
      id,
      nickname,
      profileImage: profileFile,
    };

    const response = await got(
      ApiPath.Partner_INFO,
      'PATCH',
      params,
      await getAccessToken(ApiPath.Partner_INFO),
      true
    );

    if (response.status === 1) {
      popup('수정되었습니다.');
      setProfilePath('');
      setBusinessFilePath('');
      await handleGetPartnerInfo();
      navigate('/setting');
    } else {
      popup(response.message);
    }
  };

  // 프로필 이미지 선택
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileFile(file);
      setProfilePath(URL.createObjectURL(file));
    }
  };

  // 주소 모달 오픈
  const openPostcode = () => {
    if (postOn) return;
    setPostOn(true);
    setShowPostcode(true);
  };

  return (
    <>
      <div className="detail-mypage content">
        {/* 프로필 이미지 카드 */}
        <div className="profile-grid">
          <p className="label">프로필 이미지</p>
          <div className="card">
            <div className="image-box">
              <img
                src={
                  profilePath
                    ? profilePath
                    : `${process.env.URL}${ApiPath.DECTECTVIE_PROFILE_IMAGE}/${id}?t=${Date.now()}`
                }
                alt="profile"
              />
            </div>

            <input
              type="file"
              className="file-input"
              accept="image/*"
              onChange={handleProfileChange}
            />
          </div>
        </div>

        {/* 상세 정보 토글 버튼 */}
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setShowBusinessDetail(!showBusinessDetail)}
        >
          <span>상세 정보</span>
          <span className={`arrow ${showBusinessDetail ? 'open' : ''}`}>
            <i className="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        {/* 상세 정보 입력 영역 (아코디언) */}
        {showBusinessDetail && (
          <div className="accordion-content">
            <div className="input-group">
              <p>닉네임</p>
              <p className="opcity">현재: {originalNickname}</p>
              <div className="input-group__input">
                <input
                  type="text"
                  placeholder="입력해주세요."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

          </div>
        )}

        {/* 저장 버튼 */}
        <div className="button-group">
          <button type="button" className="save-btn" onClick={handleUpdate}>
            수정하기
          </button>
        </div>
      </div>

      {/* 우편번호 검색 팝업 */}
      {showPostcode && (
        <PostcodeEmbed
          onSelect={(data: any) => {
            let selectedAddress =
              data.userSelectedType === 'R'
                ? data.roadAddress
                : data.jibunAddress;

            if (data.userSelectedType === 'R' && data.buildingName) {
              selectedAddress += ` (${data.buildingName})`;
            }

            setBusinessAddress(selectedAddress);
            setBusinessZipcode(data.zonecode);
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

export default PartnerProfile;