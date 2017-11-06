import { HangfenPage } from './app.po';

describe('hangfen App', () => {
  let page: HangfenPage;

  beforeEach(() => {
    page = new HangfenPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
