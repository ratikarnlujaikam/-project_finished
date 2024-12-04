import * as React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export const TotalMoney = ({totalAmountWithVat,handleClearCart}) => {

const nevigate = useNavigate();

const nextcheckout = () => {
  nevigate("/checkout");
}
  return (
    <>
      <Stack sx={{  pt: 4, px: 2 }}>
        <Divider sx={{ my: 4 }} />
        {/* Total */}

        <Stack>
          <Stack
            direction='row'
            sx={{
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Typography variant='h4'>TOTAL</Typography>
            <Typography variant='h4'>฿{totalAmountWithVat.toFixed(2)}</Typography>
          </Stack>
          <Stack
            direction='row'
            sx={{
              justifyContent: "space-between",
              mx: 2,
              mt: 2,
            }}
          >
            <Button
              variant='contained'
              color='error'
              sx={{ py: 2, px: 2, borderRadius: 2 }}
              onClick={handleClearCart}
            >
              <Stack>
                <Typography fontSize={16} fontWeight={500} sx={{ color: "#000" }}>
                  CANCEL ORDER
                </Typography>
              </Stack>
            </Button>
            <Button
              variant='contained'
              sx={{ py: 2, px: 2, bgcolor: "#B1CED4", borderRadius: 2 }}
              onClick={nextcheckout}
            >
              <Stack>
                <Typography fontSize={16} fontWeight={500} sx={{ color: "#000" }} >
                  SEND ORDER
                </Typography>
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
