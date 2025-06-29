import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import './section-header.css';

interface SectionHeaderProps {
  title: string;
  counter: number;
  sortByValue: string[];
  filterOptions: string[];
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, counter, sortByValue, filterOptions }) => {
  const [selectedValue, setSelectedValue] = React.useState<string>('Date Created');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElFilter, setAnchorElFilter] = React.useState<null | HTMLElement>(null);

  function handleMenuOpen(event: React.MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose(option?: string): void {
    setAnchorEl(null);
    if (option && option !== selectedValue) {
      setSelectedValue(option);
    }
  }

  function handleFilterMenuOpen(event: React.MouseEvent<HTMLButtonElement>): void {
    setAnchorElFilter(event.currentTarget);
  }

  function handleFilterMenuClose(): void {
    setAnchorElFilter(null);
  }

  return (
    <Box className="container-section-header">
      <Typography variant="body1" color="secondary">{`Total: ${counter} ${title}`}</Typography>

      <Box className="filters-section-header" display="flex" alignItems="center" gap="16px">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleMenuOpen}
          endIcon={<KeyboardArrowDownIcon sx={{ width: '24px', height: '24px', color: '#7E92A2' }} />}
          className="filter-button-section-header"
        >
          Sort By: {selectedValue}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleMenuClose()}>
          {sortByValue.map((val, index) => (
            <MenuItem key={index} onClick={() => handleMenuClose(val)}>
              {val}
            </MenuItem>
          ))}
        </Menu>

        <Button
          className="filter-button-section-header"
          variant="outlined"
          color="secondary"
          onClick={handleFilterMenuOpen}
          startIcon={<FilterAltOutlinedIcon sx={{ width: '24px', height: '24px', color: '#7E92A2' }} />}
        >
          Filter
        </Button>
        <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterMenuClose}>
          {filterOptions.map((option, index) => (
            <MenuItem key={index} onClick={() => handleFilterMenuClose()}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default SectionHeader;
