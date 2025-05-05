import * as React from 'react';
import { IntroDescription, IntroImage, IntroSubTitle, IntroTitle } from './Introduce.css';

export interface IntroduceTemplateProps {
    title: React.ReactNode;
    // icon: React.ReactNode;
    subTitle: string;
    description: React.ReactNode;
    image: string;
}

export default function IntroduceTemplate({
    title,
    // icon,
    subTitle,
    description,
    image,
}: IntroduceTemplateProps) {
    return (
        <div>
            <IntroTitle>{title}</IntroTitle>
            <IntroSubTitle>
                {subTitle}
            </IntroSubTitle>
            <IntroDescription>{description}</IntroDescription>
            <IntroImage width="500" height="500" alt={`${title} 대표 이미지`} src={image} />
        </div>
    );
}
