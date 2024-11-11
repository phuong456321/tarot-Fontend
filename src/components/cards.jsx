import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import "./styles/detail.css";
import Head from "./header";
import SpeedDial from "@mui/material/SpeedDial";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import cardData from "../card_data.js";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Cards() {
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [selectedSuits, setSelectedSuits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    try {
      if (cardData && Array.isArray(cardData.cards)) {
        setAllCards(cardData.cards);
        setCards(cardData.cards);
      } else {
        console.error("Card data is not in the expected format");
        setAllCards([]);
        setCards([]);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setAllCards([]);
      setCards([]);
    }
  };

  const handleCheckboxChange = (event) => {
    const suit = event.target.value;
    if (event.target.checked) {
      // If the checkbox is checked, add the suit to selectedSuits
      setSelectedSuits(prevSuits => [...prevSuits, suit]);
    } else {
      // If the checkbox is unchecked, remove the suit from selectedSuits
      setSelectedSuits(prevSuits => prevSuits.filter(s => s !== suit));
    }
  };

  useEffect(() => {
    updateCards();
  }, [selectedSuits, searchQuery, allCards]);

  const updateCards = () => {
    let filteredCards = allCards;

    // Filter by suit
    if (selectedSuits.length > 0) {
      filteredCards = filteredCards.filter(card => selectedSuits.includes(card.suit));
    }

    // Filter by search query
    if (searchQuery) {
      filteredCards = filteredCards.filter((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setCards(filteredCards);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    updateCards();
  };

  return (
    <div>
      <Head />
      <div className="container">
        <div className="left">
          <div className="search">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>

          <div className="arr">
            <p>Suits</p>
            <hr style={{ width: "70%", opacity: "0.5" }} />
            <div className="checkbox">
              {["wands", "cups", "swords", "pentacles"].map((suit) => (
                <div key={suit}>
                  <input
                    type="checkbox"
                    id={suit}
                    name={suit}
                    value={suit}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={suit}>{suit.charAt(0).toUpperCase() + suit.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="detail"
          style={{
            width: "750px",
            border: "2px solid #561B6B",
            backgroundColor: "rgba(38, 24, 45, 0.6)",
            borderRadius: "20px",
            backdropFilter: "blur(30px)",
          }}>
          <div className="content">
            <Box sx={{ width: "90%" }}>
              <h2>Tarot Cards</h2>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {cards && cards.length > 0 ? (
                  cards.map((card, index) => (
                    <Grid item xs={4} key={index}>
                      <a href={`/card/detail/${encodeURIComponent(card.name_short)}`}>
                        <img src={card.image_url} alt={card.name} loading="lazy" />
                        <div className="card-description">
                          <p>{card.name}</p>
                        </div>
                      </a>
                    </Grid>
                  ))
                ) : (
                  <p>No cards available</p>
                )}
              </Grid>
            </Box>
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
              className="custom-speed-dial"
              icon={<ChatIcon />}
            />
          </a>
        </Box>
      </div>
    </div>
  );
}

export default Cards;