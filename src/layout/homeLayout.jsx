import { Outlet } from "react-router-dom";
import HomeNavbar from "../navbar/homeNavbar.jsx";
import Footer from '../components/footer.jsx'


export default function HomeLayout() {
  return (
    <>
      <div id="detail">
        <nav>

          <HomeNavbar />
   
          
        </nav>
        <Outlet />
        <Footer/>
      </div>
    </>
  );
}
