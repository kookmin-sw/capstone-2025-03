import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Category() {
    const { id } = useParams();

    return <div>카테고리</div>;
}
