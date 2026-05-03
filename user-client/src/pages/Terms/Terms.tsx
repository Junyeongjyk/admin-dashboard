import TermsList from "./TermsList";
import "./Layout.scss";

export default function Terms() {
  return (
    <div className="content">
      <h1>Terms</h1>
      <p>이용약관</p>
      <TermsList/>
    </div>
  );
}