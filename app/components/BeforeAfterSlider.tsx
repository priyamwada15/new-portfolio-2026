"use client";

import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  startPercent?: number;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  startPercent = 50,
}: Props) {
  const dashedBorder =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='28' ry='28' stroke='%23E6E6E6' stroke-width='1.5' stroke-dasharray='8 8' stroke-linecap='round'/%3E%3C/svg%3E\")";

  return (
    <div
      className="w-full mt-10 rounded-2xl min-[400px]:rounded-[28px]"
      style={{ backgroundImage: dashedBorder, padding: "1px" }}
    >
      <div className="w-full overflow-hidden rounded-[15px] min-[400px]:rounded-[27px]">
        <ReactBeforeSliderComponent
          firstImage={{ imageUrl: beforeSrc, alt: beforeAlt }}
          secondImage={{ imageUrl: afterSrc, alt: afterAlt }}
          currentPercentPosition={startPercent}
          delimiterColor="#E6E6E6"
          delimiterIconStyles={{
            width: "44px",
            height: "44px",
            backgroundSize: "cover",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
        />
      </div>
    </div>
  );
}
