type GenerateTxFunctionParams = {
  setError: (value: string) => void;
  setLoading: (value: boolean) => void;
  errorMessage: string;
  callbackFunction: () => Promise<void>;
};

export async function generateTxFunction({
  setError,
  setLoading,
  errorMessage,
  callbackFunction,
}: GenerateTxFunctionParams) {
  setError('');
  setLoading(true);
  try {
    await callbackFunction();
  } catch (e) {
    console.log(e);
    setError(errorMessage);
  }
  setLoading(false);
}
