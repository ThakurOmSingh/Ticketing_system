import * as React from 'react';
import Button from '@mui/material/Button';


const TicketDialog = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button>

      </React.Fragment>
    );
}

export default TicketDialog