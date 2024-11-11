import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/detail.css"; // Your custom styles
import SpeedDial from "@mui/material/SpeedDial";
import ChatIcon from "@mui/icons-material/Chat";
import Box from "@mui/material/Box";
import Head from "./header";
import cardData from "../card_data";
function DetailTarot() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name_short } = useParams(); // Assuming you're passing name_short in the URL
  
  useEffect(() => {
    const findCard = () => {
      const foundCard = cardData.cards.find(c => c.name_short === name_short);
      if (foundCard) {
        setCard(foundCard);
        setLoading(false);
      } else {
        setError('Card not found');
        setLoading(false);
      }
    };

    findCard();
  }, [name_short]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!card) {
    return <div>Card not found</div>;
  }

  return (
    <div>
      <Head />
      <div className="container body2">
        <h1>Chi tiết về lá bài Tarot</h1>
        <div className="detail">
          <div className="content">
            <div className="info">
              <h2>Name: {card.name}</h2>
              <p>
                <strong>Meaning: {card.meaning_up}</strong>
              </p>
              <p>
                <strong>Reversed Meaning: {card.meaning_rev}</strong>
              </p>
            </div>
            <div className="swiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  Image: <img src={card.image_url} alt={card.name} />
                </div>
              </div>
            </div>
          </div>
          <p
            className="description"
            style={{ margin: "0px 0px 0px 0px", textAlign: "left" }}>
            <strong>Description: </strong>
            {card.desc}
          </p>
        </div>
      </div>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}>
        <a href="/">
          <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            sx={{
              position: "relative",
            }}
            className="custom-speed-dial" // Add the custom class
            icon={<ChatIcon />}
          />
        </a>
      </Box>
    </div>
  );
}

export default DetailTarot;
