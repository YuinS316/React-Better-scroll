import React, { CSSProperties, useEffect, useState, useCallback } from "react";
import Scroll from "./scroll";
import axios, { Method } from "axios";

export interface TestProps {}

interface ResponseType {
  code: number;
  data: any;
}

const Test: React.FC<TestProps> = () => {
  const style: CSSProperties = {
    width: "500px",
  };

  const request = (url: string, method: Method): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method,
      };
      axios(options)
        .then((res) => {
          const data = res.data as ResponseType;
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  };

  const getData = () => request("/api/datasource", "GET");

  const getMore = () => request("/api/abc", "GET");

  const [state, setstate] = useState<any[]>([]);

  useEffect(() => {
    (async function () {
      const res = await getData();
      console.log(res);
      res.code === 0 && setstate(res.data);
    })();
  }, []);

  const handlePullUp = useCallback(async () => {
    const res = await getMore();
    res.code === 0 && setstate(state.concat(res.data));
  }, [state]);

  async function handlePullDown() {
    const res = await getData();
    res.code === 0 && setstate(res.data);
  }

  return (
    <div style={style}>
      <Scroll
        wrapHeight="300px"
        prop={state}
        onPullup={handlePullUp}
        onPulldown={handlePullDown}
      >
        {state.map((item, idx) =>
          idx % 2 === 0 ? (
            <div key={idx} style={{ height: "200px", background: "red" }}>
              {item}
            </div>
          ) : (
            <div key={idx} style={{ height: "200px", background: "green" }}>
              {item}
            </div>
          )
        )}
      </Scroll>
    </div>
  );
};

export default Test;
