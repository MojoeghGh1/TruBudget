import ButtonBase from "@material-ui/core/ButtonBase";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { withStyles } from "@material-ui/core";
import Input from "@material-ui/core/Input";

const styles = {
  searchBar: {
    display: "flex"
  },
  searchField: {
    padding: "2px",
    margin: "5px",
    width: "270px",
    display: "flex",
    flexDirection: "row",
    opacity: "0.8",
    boxShadow: "none"
  },
  formField: {
    width: "90%"
  },
  formControlField: {
    width: "97%",
    paddingLeft: "5px"
  }
};
const Searchbar = ({
  searchBarDisplayed,
  searchDisabled,
  searchTerm,
  storeSearchBarDisplayed,
  storeSearchTerm,
  autoSearch = false,
  previewText,
  isSearchBarDisplayedByDefault = false
}) => {
  return (
    <div style={styles.searchBar} data-test="search-bar">
      {searchBarDisplayed && !searchDisabled ? (
        <Paper style={styles.searchField}>
          <form onSubmit={e => e.preventDefault()} style={styles.formField}>
            <FormControl style={styles.formControlField} data-test="search-input">
              <Input
                value={searchTerm}
                placeholder={previewText}
                autoFocus={!isSearchBarDisplayedByDefault}
                onChange={autoSearch ? event => storeSearchTerm(event.target.value) : null}
                onKeyDown={e => {
                  if (!isSearchBarDisplayedByDefault && (e.key === "Escape" || e.key === "Esc")) {
                    storeSearchTerm("");
                    storeSearchBarDisplayed(false);
                  } else if (e.key === "Enter") {
                    storeSearchTerm(e.target.value);
                  }
                }}
              />
            </FormControl>
          </form>
          <ButtonBase
            data-test="clear-searchbar"
            onClick={() => {
              storeSearchTerm("");
              if (!isSearchBarDisplayedByDefault) {
                storeSearchBarDisplayed(false);
              }
            }}
          >
            <CancelIcon color="action" />
          </ButtonBase>
        </Paper>
      ) : null}
      <div>
        <Tooltip
          title="Quick search"
          disableHoverListener={searchDisabled}
          disableFocusListener={searchDisabled}
          disableTouchListener={searchDisabled}
        >
          <div>
            <IconButton
              color="primary"
              onClick={() => {
                if (!isSearchBarDisplayedByDefault) {
                  // Searchbar can only be reseted when Searchbar can be toggled
                  storeSearchTerm("");
                  storeSearchBarDisplayed(!searchBarDisplayed);
                }
              }}
              disabled={searchDisabled}
              data-test="toggle-searchbar"
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default withStyles(styles)(Searchbar);
