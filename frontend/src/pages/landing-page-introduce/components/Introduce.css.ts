import styled from '@emotion/styled';

// 폰트 관련 상수 모음 fontVars
export const fontVars = {
    fontFamily: {
        pretendard: 'Pretendard, sans-serif',
        gmarketSansTTF: 'gmarketSansTTF, sans-serif',
    },
    fontWeight: {
        regular: '400',
        semibold: '600',
        bold: '700',
    },
    fontSize: {
        title1: '2.8rem',
        title2: '2.4rem',
        title3: '2.0rem',
        title4: '1.8rem',
        body1: '1.5rem',
        body2: '1.4rem',
        caption: '1.3rem',
        button1: '1.6rem',
        button2: '1.4rem',
        etc: '2.6rem',
    },
    lineHeight: {
        title1: '4.0rem',
        title2: '3.4rem',
        title3: '2.6rem',
        title4: '2.4rem',
        body1: '2.4rem',
        body1Bold: '2.3rem',
        body2: '2.0rem',
        caption: '1.8rem',
        button1: '2.6rem',
        button2: '2.2rem',
        etc: '4.4rem',
    },
    letterSpacing: {
        tight: '-0.6%',
        normal: '0%',
        loose: '-0.2%',
    },
};

export const title1 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.bold,
    fontSize: fontVars.fontSize.title1,
    lineHeight: fontVars.lineHeight.title1,
    letterSpacing: fontVars.letterSpacing.tight,
};

export const title2 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.bold,
    fontSize: fontVars.fontSize.title2,
    lineHeight: fontVars.lineHeight.title2,
    letterSpacing: fontVars.letterSpacing.normal,
};

export const title3 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.bold,
    fontSize: fontVars.fontSize.title3,
    lineHeight: fontVars.lineHeight.title3,
    letterSpacing: fontVars.letterSpacing.normal,
};

export const title4 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.semibold,
    fontSize: fontVars.fontSize.title4,
    lineHeight: fontVars.lineHeight.title4,
    letterSpacing: fontVars.letterSpacing.loose,
};

export const body1 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.regular,
    fontSize: fontVars.fontSize.body1,
    lineHeight: fontVars.lineHeight.body1,
    letterSpacing: fontVars.letterSpacing.loose,
};

export const body1Bold = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.bold,
    fontSize: fontVars.fontSize.body1,
    lineHeight: fontVars.lineHeight.body1Bold,
    letterSpacing: fontVars.letterSpacing.loose,
};

export const body2 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.regular,
    fontSize: fontVars.fontSize.body2,
    lineHeight: fontVars.lineHeight.body2,
    letterSpacing: fontVars.letterSpacing.loose,
};

export const body2Bold = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.bold,
    fontSize: fontVars.fontSize.body2,
    lineHeight: fontVars.lineHeight.body2,
    letterSpacing: fontVars.letterSpacing.loose,
};

export const caption = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.regular,
    fontSize: fontVars.fontSize.caption,
    lineHeight: fontVars.lineHeight.caption,
    letterSpacing: fontVars.letterSpacing.loose,
};

export const button1 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.semibold,
    fontSize: fontVars.fontSize.button1,
    lineHeight: fontVars.lineHeight.button1,
    letterSpacing: fontVars.letterSpacing.tight,
};

export const button2 = {
    fontFamily: fontVars.fontFamily.pretendard,
    fontWeight: fontVars.fontWeight.semibold,
    fontSize: fontVars.fontSize.button2,
    lineHeight: fontVars.lineHeight.button2,
    letterSpacing: fontVars.letterSpacing.tight,
};

// IntroduceMain
export const IntroMainContainer = styled.div`
    background-color: #101012;
`;

export const IntroMainTitle = styled.h1`
    margin-bottom: 2.1rem;
    font-family: ${fontVars.fontFamily.pretendard};
    font-weight: ${fontVars.fontWeight.bold};
    font-size: 2.4rem;
    line-height: ${fontVars.lineHeight.title2};
    letter-spacing: ${fontVars.letterSpacing.normal};
`;

export const IntroMainImage = styled.img`
    margin-bottom: 2rem;
    width: 100%;
    height: auto;
`;

export const IntroMainSubTitle = styled.p`
    margin-bottom: 1.3rem;
    font-family: ${fontVars.fontFamily.pretendard};
    font-weight: ${fontVars.fontWeight.semibold};
    font-size: ${fontVars.fontSize.title4};
    line-height: ${fontVars.lineHeight.title4};
    letter-spacing: ${fontVars.letterSpacing.loose};
`;

export const IntroMainDescription = styled.p`
    font-family: ${body1.fontFamily};
    font-weight: ${body1.fontWeight};
    font-size: ${body1.fontSize};
    line-height: ${body1.lineHeight};
    letter-spacing: ${body1.letterSpacing};
`;

// Introduce Page
export const IntroducePage = styled.div`
    padding: 2.3rem 2rem 0rem 2rem;
    cursor: pointer;
    background-color: #101012;
`;

export const ProgressBarContainer = styled.div`
    background: #bcbcbc;
`;

export const ProgressBar = styled.div`
    background: #777777;
    height: 0.4rem;
    margin-bottom: 1.6rem;
    transition: all ease-out 0.3s;
`;

export const CarouselContainer = styled.div`
    overflow: hidden;
`;

export const CarouselWrapper = styled.div`
    display: flex;
    gap: 2rem;
`;

export const CarouselSlider = styled.div`
    flex: 0 0 100%;
    min-width: 0;
    user-select: none;
`;

// IntroduceTemplate
export const IntroTitle = styled.h1`
    margin-bottom: 2.6rem;
    font-size: 2.4rem;
`;

export const IntroSubTitle = styled.div`
    margin-bottom: 1.3rem;
    display: flex;
    align-items: center;
    font-family: ${fontVars.fontFamily.pretendard};
    font-weight: ${fontVars.fontWeight.semibold};
    font-size: ${fontVars.fontSize.title4};
    line-height: ${fontVars.lineHeight.title4};
    letter-spacing: ${fontVars.letterSpacing.loose};
`;

export const IntroDescription = styled.p`
    margin-bottom: 2rem;
    font-family: ${fontVars.fontFamily.pretendard};
    font-weight: ${fontVars.fontWeight.regular};
    font-size: ${fontVars.fontSize.body1};
    line-height: ${fontVars.lineHeight.body1};
    letter-spacing: ${fontVars.letterSpacing.loose};
`;

export const IntroImage = styled.img`
    width: 100%;
    height: auto;
`;

// IntroduceEnd
export const IntroEndTitle = styled.h1`
    margin-bottom: 4.3rem;
    font-family: ${fontVars.fontFamily.pretendard};
    font-weight: ${fontVars.fontWeight.bold};
    font-size: ${fontVars.fontSize.title2};
    line-height: ${fontVars.lineHeight.title2};
    letter-spacing: ${fontVars.letterSpacing.normal};
`;

export const IntroEndImage = styled.img`
    padding: 0 -2rem;
    width: 100%;
    height: auto;
    margin-bottom: 1.6rem;
`;

export const IntroEndDescription = styled.p`
    text-align: center;
    margin-bottom: 1.6rem;
`;

export const IntroEndSeparator = styled.div`
    width: 100%;
    border-top: 1px dashed white;
    margin: 2.1rem 0;
`;

export const IntroButton = styled.button`
    width: 100%;
    padding: 1.8rem;
    background-color: white;
    color: black;
    border-radius: 0.6rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
`

export const BugButton = styled.button`
    width: 100%;
    padding: 1.8rem;
    background-color: gray;
    color: black;
    border-radius: 0.6rem;
    margin-bottom: 1rem;
`