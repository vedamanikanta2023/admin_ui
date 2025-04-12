import * as React from "react"
import { useMemo } from "react";

const MemoComp=(props)=>{
    const {data} = props;

    const processdData = useMemo(()=>{
        const processed = [...data].filter(rec=>String(rec.email).includes("j"));
        return processed;
    },[data]);
    console.log('props,processdData',props,processdData);
    return<div>{processdData[0].email}</div>
}

export default MemoComp;