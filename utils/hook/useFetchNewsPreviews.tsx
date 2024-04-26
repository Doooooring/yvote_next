import { Preview } from "@utils/interface/news";
import NewsRepository from '@repositories/news';
import { useState } from "react";

export const useFetchNewsPreviews = (limit : number) => {
    let page : number = 0;
    let prevFilter : string | null = null;

    const [previews, setPreviews] = useState<Preview[]>([]);

    const fetchPreviews  = async (filter : string | null) => {
        
        let arr = previews;

        if (filter == prevFilter && page === -1) return;

        if (filter != prevFilter) {
            page = 0;
            arr = [];
        }

        const datas  : Array<Preview> = await NewsRepository.getPreviews( page, filter )
        
        if (datas.length == 0) {
            page = -1;
            return;
        }
        
        page += 20;
        prevFilter = filter;
        setPreviews([...arr, ...datas]);
    }

    return {
        page,
        previews,
        fetchPreviews
    }
}