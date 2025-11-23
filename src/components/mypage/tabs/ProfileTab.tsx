// src/components/mypage/tabs/ProfileTab.tsx
import React, { useRef } from "react";
import Button from "@/components/common/Button";
import ProfileIcon from "@/assets/svgs/profileIcon.svg?react";

interface ProfileTabProps {
  userData: any;
  nickname: string;
  setNickname: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  isEditMode: boolean;
  handleEditMode: () => void;
  handleCancelEdit: () => void;
  handleUpdateInfo: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  updateProfileMutation: any;
  uploadImageMutation: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userData,
  nickname,
  setNickname,
  email,
  isEditMode,
  handleEditMode,
  handleCancelEdit,
  handleUpdateInfo,
  handleImageUpload,
  triggerFileInput,
  updateProfileMutation,
  uploadImageMutation,
  fileInputRef,
}) => {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-main mb-4 md:mb-6 border-b pb-2">내 정보 조회/수정</h3>

      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6 md:mb-10">
        <div className="flex items-center space-x-4 md:space-x-6">
          {userData?.profileImageUrl ? (
            <img 
              src={userData.profileImageUrl} 
              alt="프로필 사진" 
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-main"
            />
          ) : (
            <ProfileIcon className="w-20 h-20 md:w-24 md:h-24 text-main bg-gray-100 rounded-full p-1" title="프로필 사진" />
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {uploadImageMutation.isPending && <p className="text-main text-xs md:text-sm">이미지 업로드 중...</p>}
        </div>

        {isEditMode && (
          <div>
            <Button
              variant="bright_main"
              size="md"
              className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
              onClick={triggerFileInput}
              disabled={uploadImageMutation.isPending}
            >
              프로필 사진 수정
            </Button>
          </div>
        )}
      </div>

      <div className={`${isEditMode ? "bg-main-bright p-3 rounded-md" : "border-b-2 border-main focus:border-main outline-none"} mb-4 md:mb-6`}>
        <label htmlFor="nickname" className="block text-main text-base md:text-lg font-medium mb-2">닉네임</label>
        <input
          type="text"
          id="nickname"
          className="w-full pb-2 text-base md:text-lg text-main bg-transparent"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={!isEditMode}
        />
      </div>

      <div className={`${isEditMode ? "" : "border-b-2 border-main focus:border-main outline-none"} mb-4 md:mb-6`}>
        <label htmlFor="email" className="block text-main text-base md:text-lg font-medium mb-2">이메일 주소</label>
        <textarea
          id="email"
          rows={1}
          className="w-full pb-2 text-base md:text-lg text-main bg-transparent resize-none rounded-md"
          value={email}
          readOnly
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-10">
        {!isEditMode ? (
          <Button 
            variant="bright_main" 
            size="lg" 
            className="px-6 py-2 md:px-8 md:py-3 rounded-md text-sm md:text-base w-full sm:w-auto" 
            onClick={handleEditMode}
          >
            정보 수정하기
          </Button>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="lg" 
              className="px-6 py-2 md:px-8 md:py-3 rounded-md text-main text-sm md:text-base w-full sm:w-auto" 
              onClick={handleCancelEdit} 
              disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}
            >
              취소
            </Button>
            <Button 
              variant="bright_main" 
              size="md" 
              className="px-6 py-2 md:px-8 md:py-3 rounded-md text-sm md:text-base w-full sm:w-auto" 
              onClick={handleUpdateInfo} 
              disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}
            >
              {updateProfileMutation.isPending ? "저장 중..." : "정보 수정 완료"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};