import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

// CSS-in-JS styles
const mainLayoutStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f4f8',
};

const cardStyle = {
  minWidth: 400,
  maxWidth: 500,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#ffffff',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#14919B',
};

export default function Home() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [numberPhone, setNumberPhone] = useState("");

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const showSuccess = (message) => {
    setSnackType("success");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const getUserDetails = async (accessToken) => {
    const response = await fetch("http://localhost:8080/users/myInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    setUserDetails(data.result);
  };

  const validateInputs = () => {
    if (!password || !dob || !gender || !address || !numberPhone) {
      showError("Vui lòng điền tất cả các trường.");
      return false;
    }
    return true;
  };

  const addPassword = (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const body = {
      password,
      dob,
      gender,
      address,
      numberPhone,
    };

    fetch("http://localhost:8080/users/create/userInfoLoginGoogle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code !== 1000) throw new Error(data.message);

        // Refresh user details after updating
        getUserDetails(getToken());
        showSuccess(data.message);

        // Reset form fields after successful submission
        setPassword("");
        setDob("");
        setGender("");
        setAddress("");
        setNumberPhone("");

        // Redirect to the main page
        navigate("/");
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  useEffect(() => {
    const accessToken = getToken();

    if (!accessToken) {
      navigate("/");
    }

    getUserDetails(accessToken);
  }, [navigate]);

  return (
    <div style={mainLayoutStyle}>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      {userDetails ? (
        <Card sx={cardStyle}>
          <Typography variant="h5" style={titleStyle}>
            Cập nhật thông tin của bạn
          </Typography>
          {userDetails.noPassword && (
            <Box
              component="form"
              onSubmit={addPassword}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                select
                variant="outlined"
                fullWidth
                margin="normal"
                value={gender}
                required
                onChange={(e) => setGender(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Chọn Giới Tính</option>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
              </TextField>
              <TextField
                label="Ngày sinh"
                type="date"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              {/* Updated Address Field */}
              <div style={styles.field}>
                <span style={styles.label}>Địa chỉ</span>
                <input
                  type="text"
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ"
                  required
                  style={styles.input}
                />
              </div>
              {/* Updated Phone Number Field */}
              <div style={styles.field}>
                <span style={styles.label}>Số điện thoại</span>
                <input
                  type="tel"
                  name="numberPhone"
                  onChange={(e) => setNumberPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  required
                  style={styles.input}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Cập nhật thông tin
              </Button>
            </Box>
          )}
        </Card>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
          <Typography>Loading ...</Typography>
        </Box>
      )}
    </div>
  );
}

const styles = {
  field: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
    textAlign: 'left',
  },
  input: {
    padding: '12px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
};

