import React, { useEffect, useState } from "react";
import axios from "axios";
import {getAuthHeaders} from '../../services/userService'
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenue = () => {
  const [chartData, setChartData] = useState(null); // Lưu trữ dữ liệu biểu đồ
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // Gọi API để lấy dữ liệu thống kê
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = {
          year: 2024, // Năm bạn muốn thống kê
          month: 11, // Tháng bạn muốn thống kê
        };
  
        const token = getAuthHeaders();
  
        const response = await axios.post(
          "http://localhost:8080/orders/monthly",
          request,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm Authorization Header
            },
          }
        );
  
        const { weeklyRevenue } = response.data.result;
  
        const labels = weeklyRevenue.map((week) => `Tuần ${week.week}`);
        const data = weeklyRevenue.map((week) => week.revenue);
  
        setChartData({
          labels,
          datasets: [
            {
              label: "Doanh thu (triệu đồng)",
              data,
              backgroundColor: "skyblue",
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        });
  
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tuần",
        },
      },
      y: {
        title: {
          display: true,
          text: "Doanh thu (triệu đồng)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Thống kê thu nhập theo tháng</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Không có dữ liệu để hiển thị.</p>
      )}
    </div>
  );
};

export default Revenue;
