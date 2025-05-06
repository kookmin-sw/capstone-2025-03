import * as React from 'react';
import FullPageCarousel from './components/FullPageCarousel';
import IntroduceMain from './components/IntroduceMain';
import IntroduceTemplate from './components/IntroduceTemplate';
import { IntroduceContents } from './components/IntroduceContents';
import { IntroducePage } from './components/Introduce.css';
import IntroduceEnd from './components/IntroduceEnd';

export default function LandingPageIntroduce() {
  return (
    <IntroducePage>
      <FullPageCarousel>
        <FullPageCarousel.Slide>
          <IntroduceMain />
        </FullPageCarousel.Slide>
        {IntroduceContents.map(({ id, title, subTitle, description, image }) => {
          return (
            <FullPageCarousel.Slide key={id}>
              <IntroduceTemplate
                title={title}
                // icon={icon}
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