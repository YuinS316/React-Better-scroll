import React, { useRef, useState, useEffect } from "react";
import BScroll from "@better-scroll/core";
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
import ObserveDOM from "@better-scroll/observe-dom";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import PullDown from "@better-scroll/pull-down";
import Pullup from "@better-scroll/pull-up";

export interface ScrollProps {
  wrapHeight: string;
  prop?: any;
  onPullup?: Function;
  onPulldown?: Function;
}

const Scroll: React.FC<ScrollProps> = ({
  wrapHeight,
  prop,
  onPullup,
  onPulldown,
  children,
}) => {
  //  Better-scroll 实例
  const wrapRef = useRef<HTMLDivElement>(null);

  //  记录Better-scroll是否实例化
  const initRef = useRef(false);

  const [scrollObj, setscrollObj] = useState<BScrollConstructor>();

  BScroll.use(ObserveDOM);
  BScroll.use(MouseWheel);
  BScroll.use(ScrollBar);
  BScroll.use(PullDown);
  BScroll.use(Pullup);

  const initBScroll = () => {
    setscrollObj(
      new BScroll(wrapRef.current as HTMLDivElement, {
        probetype: 3,
        //  可以使用原生的点击
        click: true,
        //  检测dom变化
        observeDOM: true,
        //  鼠标滚轮设置
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300,
        },
        //  显示滚动条
        scrollY: true,
        scrollbar: true,
        //  过度动画
        useTransition: true,
        //  下拉刷新
        pullDownRefresh: {
          threshold: 70,
          stop: 0,
        },
        //  上拉加载更多
        pullUpLoad: {
          threshold: 90,
          stop: 10,
        },
      })
    );
  };

  //  对象初始化
  useEffect(() => {
    initBScroll();
    return () => {
      scrollObj?.destroy();
    };
  }, []);

  const pulldown = async () => {
    onPulldown && (await onPulldown());
    setTimeout(() => {
      scrollObj?.finishPullDown();
      scrollObj?.refresh();
    }, 500);
  };

  const pullup = async () => {
    onPullup && (await onPullup());
    setTimeout(() => {
      scrollObj?.finishPullUp();
      scrollObj?.refresh();
    }, 500);
  };

  //  对象事件挂载
  useEffect(() => {
    if (initRef.current === true) {
      //  下拉刷新
      //  每次更新都需要先把之前的pullingDown事件清除，不然会累加
      scrollObj?.off("pullingDown");
      scrollObj?.once("pullingDown", pulldown);

      //  上拉加载
      //  每次更新都需要先把之前的pullingDown事件清除，不然会累加
      scrollObj?.off("pullingUp");
      scrollObj?.once("pullingUp", pullup);
    } else {
      initRef.current = true;
    }
    //  为什么监听prop是因为这边监听不到外面的state变化
    //  handlePullUp的[...state, ...res.data]中的state会中始终为一开始的[]
  }, [prop]);

  return (
    <div
      className="scroll-warpper"
      ref={wrapRef}
      style={{ height: wrapHeight, overflow: "hidden", border: "1px solid" }}
    >
      <div className="scroll-content">{children}</div>
    </div>
  );
};

export default Scroll;
