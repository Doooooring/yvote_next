import { Preview } from "@utils/interface/news";
import NewsRepository from '@repositories/news';
import { MutableRefObject, useRef, useState } from "react";

export const useFetchNewsPreviews = (limit : number) => {
    let page = useRef(0);
    let prevFilter : MutableRefObject<string | null | undefined> = useRef(null);

    const [isRequesting, setIsRequesting] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [previews, setPreviews] = useState<Preview[]>([]);

    const fetchPreviews  = async (filter? : string | null) => {
        let arr = previews;

        if (filter === prevFilter.current && page.current === -1) return;

        if (filter && filter != prevFilter.current) {
            prevFilter.current = filter;
            page.current = 0;
            arr = [];
        }

        try {   
            setIsRequesting(true);
            const datas  : Array<Preview> = await NewsRepository.getPreviews( page.current, prevFilter.current)

            if (datas.length === 0) {
                page.current = -1;
                return;
            }
            
            page.current += 20;
            setPreviews([...arr, ...datas]);
        } catch (e) {
            setIsError(true)
        } finally {
            setIsRequesting(false);
        }
    }

    return {
        page : page.current,
        isRequesting,
        isError,
        previews,
        fetchPreviews
    }
}