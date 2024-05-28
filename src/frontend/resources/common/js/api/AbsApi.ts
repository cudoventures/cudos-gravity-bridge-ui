export default abstract class AbsApi {
  enableActions: null | (() => void);
  disableActions: null | (() => void);
  showAlert:
    | null
    | ((
        msg: string,
        positiveListener?: null | (() => boolean | void),
        negativeListener?: null | (() => boolean | void)
      ) => void) = null;

  constructor(
    enableActions: null | (() => void) = null,
    disableActions: null | (() => void) = null,
    showAlert:
      | null
      | ((
          msg: string,
          positiveListener?: null | (() => boolean | void),
          negativeListener?: null | (() => boolean | void)
        ) => void) = null
  ) {
    this.enableActions = enableActions;
    this.disableActions = disableActions;
    this.showAlert = showAlert;
  }
}
