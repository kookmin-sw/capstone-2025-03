import * as React from 'react';
import FullPageCarousel from './components/FullPageCarousel';
import IntroduceMain from './components/IntroduceMain';
import IntroduceTemplate from './components/IntroduceTemplate';
import { introduceContents } from './components/IntroduceContents';
import { IntroducePage } from './components/Introduce.css';
import IntroduceEnd from './components/IntroduceEnd';

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