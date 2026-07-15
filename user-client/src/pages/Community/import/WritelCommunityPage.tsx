
import { useNavigate } from "react-router-dom";
import { useUserStore } from "src/stores/userStore";
import WritelCommunity from "./WritelCommunity";

export default function WritelCommunityPage() {
  const navigate = useNavigate();
  const userInfo = useUserStore((state) => state.userInfo);

  const listReset = () => {
    navigate("/community");
  };

  const changeListView = () => {
    navigate("/community");
  };

  return (
    <WritelCommunity
      changeListView={changeListView}
      listReset={listReset}
      userInfo={userInfo}
    />
  );
}