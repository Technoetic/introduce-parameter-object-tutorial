// @MX:NOTE App orchestration uses async init and injected collaborators, matching the project architecture rule.
export class TutorialApp {
  constructor({ renderer }) {
    this.renderer = renderer;
  }

  async init() {
    await this.renderer.init();
  }
}
