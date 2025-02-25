import styles from "./AddressSearch.module.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    daum: any;
  }
}

export default function AddressSearch() {
  const navigate = useNavigate();
  const postcodeRef = useRef<HTMLDivElement | null>(null);
  const isScriptLoaded = useRef(false);

  useEffect(() => {
    if (isScriptLoaded.current) return;
    isScriptLoaded.current = true;

    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (postcodeRef.current) {
        const postcode = new window.daum.Postcode({
          oncomplete: (data: { address: string }) => {
            navigate("/address-input", { state: { address: data.address } });
          },
          width: "100%",
          height: "100%",
        });

        postcode.embed(postcodeRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img
            src="src/assets/images/chevron-left.svg"
            alt="뒤로가기"
            width="30"
          />
        </button>
        <p className={styles.title}>주소 검색</p>
        <div className={styles.emptyBox} />
      </div>

      <div className={styles.postcodeBox} ref={postcodeRef} />
    </div>
  );
}
