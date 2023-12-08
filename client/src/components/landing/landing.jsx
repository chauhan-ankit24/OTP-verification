import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();

  return (
    <div style={{ "width": "100vw", "height": "100vh", "display": "flex", "justifyContent": "center", "alignItems": "center", "flexDirection": "column" }}>
      <h1>welcome</h1>
      <button onClick={() => navigate('/Login')}> logout </button>
    </div>
  )
}
