import React, { useEffect, useRef, useState } from "react";
import { getAllDiscount } from '../../services/discountService';

const Discount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [copyMessage, setCopyMessage] = useState("");
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetchAllDiscount();
    }, []);

    const fetchAllDiscount = async () => {
        try {
            const response = await getAllDiscount();
            setDiscounts(response);
        } catch (error) {
            console.error('Không thể lấy thông tin giảm giá');
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopyMessage(`Đã copy mã: ${code}`);
                setTimeout(() => setCopyMessage(""), 2000);
            })
            .catch(() => {
                setCopyMessage("Không thể copy mã giảm giá.");
                setTimeout(() => setCopyMessage(""), 2000);
            });
    };

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="container mt-3 position-relative">
            <h3 className="mb-3">Danh sách mã giảm giá</h3>
            {discounts.length > 3 && (
                <>
                    <button
                        className="btn btn-secondary position-absolute"
                        style={{ top: "50%", left: "-50px", transform: "translateY(-50%)" }}
                        onClick={() => handleScroll("left")}
                    >
                        ◀
                    </button>
                    <button
                        className="btn btn-secondary position-absolute"
                        style={{ top: "50%", right: "-50px", transform: "translateY(-50%)" }}
                        onClick={() => handleScroll("right")}
                    >
                        ▶
                    </button>
                </>
            )}
            <div
                className="row flex-nowrap"
                style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden", // Ẩn thanh cuộn
                    position: "relative",
                }}
                ref={scrollContainerRef}
            >
                {discounts.length === 0 ? (
                    <p className="text-center w-100">Không có mã giảm giá nào</p>
                ) : (
                    discounts.map((item, index) => (
                        <div className="col-4 mb-4 d-inline-block" key={index} style={{ width: "300px" }}>
                            <div className="discount p-3 border rounded d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="mb-2">Mã giảm giá</h5>
                                    <p className="mb-1 font-weight-bold">{item.code}</p>
                                    <p>Giảm {item.discountValue}{item.code.slice(-2) === "PT" ? "%" : "K"}</p>
                                </div>
                                <div className="text-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleCopyCode(item.code)}
                                    >
                                        Sao chép
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {copyMessage && (
                <div className="alert alert-success mt-3 text-center">
                    {copyMessage}
                </div>
            )}
        </div>
    );
};

export default Discount;
