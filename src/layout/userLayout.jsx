import { Outlet } from "react-router-dom";
import UserNavbar from "../navbar/userNavbar.jsx";
import Footer from '../components/footer.jsx'


export default function HomeLayout() {
  return (
    <>
      <div id="detail">
        <nav>

          <UserNavbar />
           
        </nav>
        <Outlet />
        <Footer/>
      </div>
    </>
  );
}
