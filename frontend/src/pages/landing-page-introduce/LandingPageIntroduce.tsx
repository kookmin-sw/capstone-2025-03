import * as React from 'react';
import FullPageCarousel from '@/components/introduce/FullPageCarousel';
import IntroduceM
import IntroduceTemplate from './IntroduceTemplate';
import { introduceContents } from './IntroduceContents';
import { IntroducePage } from './Introduce.css';
import IntroduceEnd from './IntroduceEnd';

export default function Page() {
  return (
    <IntroducePage>
      <FullPageCarousel> 전체 페이지 슬라이더 컨테이너
        <FullPageCarousel.Slide> 개별 슬라이드 하나하나
          <IntroduceMain />
        </FullPageCarousel.Slide>
        {introduceContents.map(({ id, title, icon, subTitle, description, image }) => {
          return (
            <FullPageCarousel.Slide key={id}>
              <IntroduceTemplate
                title={title}
                icon={icon}
                subTitle={subTitle}
                description={description}
                image={image}
              />
            </FullPageCarousel.Slide>
          );
        })}
        <FullPageCarousel.Slide>
          <IntroduceEnd />
        </FullPageCarousel.Slide>
      </FullPageCarousel>
    </IntroducePage>
  );
}