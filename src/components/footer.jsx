import { Box, Grid, Stack, Typography } from "@mui/material";
import Card from "react-bootstrap/Card";
import styled from "styled-components";
import { useTheme } from "../theme/themeContext.jsx";
import Image from "../images/Movies.png";

function Footer() {
  const { mode } = useTheme();

  const Gmail = () => {
    window.location.href = "https://mail.google.com/mail/";
  };
  const LinkedIn = () => {
    window.location.href = "https://in.linkedin.com/";
  };
  const Twitter = () => {
    window.location.href = "https://twitter.com/?lang=en";
  };
  const Insta = () => {
    window.location.href = "https://www.instagram.com/";
  };
  const Github = () => {
    window.location.href = "https://github.com/";
  };

  const styles = {
    textDecoration: "none",
    color: "purple",
    width: "100%",
  };

  return (
    <footer>
            <Card style={{ backgroundColor: mode === "dark" ? "#080808" : "#d4d4d4" }}>

        <Stack direction="row" alignItems="center" spacing={2}>
          <hr
            style={{
              flex: 1,
              border: 0,
              borderTop: `1px solid ${mode === "dark" ? "#fff" : "#000"}`,
              margin: 0,
            }}
          />
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: "cursive",
              color: mode === "dark" ? "#fff" : "#000",
            }}
          >
            POPCORN
            <img src={Image} alt="" style={{ marginLeft: 8, marginRight: 8, width: '50px', height: '50px' }} />
            MOVIES
          </span>
          <hr
            style={{
              flex: 1,
              border: 0,
              borderTop: `1px solid ${mode === "dark" ? "#fff" : "#000"}`,
              margin: 0,
            }}
          />
        </Stack>

        <Card.Body
          style={{
            backgroundColor: mode === "dark" ? "#000" : "#fff",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 20px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ paddingTop: "10px" }}
          >
            <img
              onClick={Gmail}
              src="https://img.icons8.com/?size=48&id=ho8QlOYvMuG3&format=png"
              alt="G-mail"
              style={{ cursor: "pointer", height: "30px", width: "30px" }}
            />
            <img
              onClick={LinkedIn}
              style={{ cursor: "pointer", height: "30px", width: "30px" }}
              src="https://img.icons8.com/?size=48&id=13930&format=png"
              alt="LinkedIn"
            />
            <img
              onClick={Twitter}
              style={{ cursor: "pointer", height: "30px", width: "30px" }}
              src="https://img.icons8.com/?size=48&id=ClbD5JTFM7FA&format=png"
              alt="TwitterX"
            />
            <img
              onClick={Insta}
              style={{ cursor: "pointer", height: "30px", width: "30px" }}
              src="https://img.icons8.com/?size=48&id=32323&format=png"
              alt="Instagram"
            />
            <img
              onClick={Github}
              style={{ cursor: "pointer", height: "30px", width: "30px" }}
              src="https://img.icons8.com/?size=48&id=AZOZNnY73haj&format=png"
              alt="GitHub"
            />
          </Stack>
          <Card.Footer
            style={{
              color: mode === "dark" ? "#fff" : "#000",
              textAlign: "center",
              fontSize: "12px",
              fontFamily: "cursive",
              padding: "5px 10px",
            }}
            className="text-muted"
          >
            Copyright © 2024 , Inc. All rights reserved.
          </Card.Footer>
        </Card.Body>
      </Card>
    </footer>
  );
}

export default Footer;

const Typographyx = styled.span`
  position: relative;
  text-decoration: none;
  cursor: pointer;
  color: #9e979e;
  font-weight: bold;
  font-size: 15px;
  font-family: cursive;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #ada6a6;
    visibility: hidden;
    transform: scaleX(0);
    transition: transform 0.5s ease-in-out;
  }

  &:hover::before {
    visibility: visible;
    transform: scaleX(1);
  }
`;
