import React, { useState, useEffect } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';
import { getMonthlyRevenue } from '../../services/orderService';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Tooltip,
    Legend
);

export default function StatisticalManagement() {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [revenueData, setRevenueData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState('bar');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        setMonth(currentMonth);
        setYear(currentYear);
    }, []);

    const fetchMonthlyRevenue = async () => {
        if (!month || !year || month < 1 || month > 12 || year <= 0) {
            setError("Vui lòng nhập tháng (1-12) và năm hợp lệ.");
            return;
        }

        setLoading(true);
        try {
            const data = await getMonthlyRevenue(month, year);
            setRevenueData(data);
            setError("");
        } catch (err) {
            setError("Không thể lấy dữ liệu. Vui lòng kiểm tra lại tháng và năm.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: revenueData?.weeklyRevenue.map((week) => `Tuần ${week.week}`),
        datasets: [
            {
                label: "Doanh thu (VNĐ)",
                data: revenueData?.weeklyRevenue.map((week) => week.weeklyRevenue),
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: revenueData?.weeklyRevenue.map((week) => `Tuần ${week.week}`),
        datasets: [
            {
                label: "Tỉ trọng doanh thu",
                data: revenueData?.weeklyRevenue.map((week) => week.weeklyRevenue),
                backgroundColor: [
                    "rgba(75,192,192,0.6)",
                    "rgba(255,99,132,0.6)",
                    "rgba(255,159,64,0.6)",
                    "rgba(153,102,255,0.6)",
                    "rgba(54,162,235,0.6)",
                    "rgba(255,205,86,0.6)",
                    "rgba(231,233,237,0.6)",
                ],
            },
        ],
    };

    return (
        <div className="container mt-3" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
            <h2 className="text-center mb-5">Quản lý thống kê doanh thu</h2>
            <div className="row mb-3">
                <div className="col-4 mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Tháng (1-12)"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        min="1"
                        max="12"
                    />
                </div>
                <div className="col-4 mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Năm"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min="1"
                    />
                </div>
                <div className="col-4 mb-3">
                    <button
                        className="btn btn-primary w-100"
                        onClick={fetchMonthlyRevenue}
                        disabled={loading}
                    >
                        {loading ? "Đang tải..." : "Xem thống kê"}
                    </button>
                </div>
            </div>

            {/* Hiển thị lỗi */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Hiển thị kết quả */}
            {revenueData && (
                <div>
                    <h5 className="text-center mt-3">
                        Doanh thu tháng {revenueData.month}/{revenueData.year}:{" "}
                        <span className="text-success">{revenueData.totalRevenue.toLocaleString()} VNĐ</span>
                    </h5>

                    {/* Thêm nút để chuyển đổi giữa các biểu đồ */}
                    <div className="d-flex justify-content-center mb-3">
                        <button
                            className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                            onClick={() => setChartType('bar')}
                        >
                            Biểu đồ cột
                        </button>
                        <button
                            className={`btn ${chartType === 'pie' ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                            onClick={() => setChartType('pie')}
                        >
                            Biểu đồ tròn
                        </button>
                    </div>

                    {/* Biểu đồ tương ứng */}
                    <div className="mt-3">
                        {chartType === 'bar' ? (
                            <Bar data={chartData} options={{ responsive: true }} height={250} />
                        ) : (
                            <Pie data={pieChartData} options={{ responsive: true }} height={250} />
                        )}
                    </div>

                    {/* Bảng doanh thu từng tuần */}
                    <table className="table table-bordered mt-3">
                        <thead className="thead-dark">
                            <tr>
                                <th>Tuần</th>
                                <th>Doanh thu (VNĐ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueData.weeklyRevenue.map((week) => (
                                <tr key={week.week}>
                                    <td>Tuần {week.week}</td>
                                    <td>{week.weeklyRevenue.toLocaleString()} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {revenueData && revenueData.weeklyRevenue.length === 0 && (
                <div className="alert alert-info mt-3">Không có doanh thu trong tháng này.</div>
            )}
        </div>
    );
}
