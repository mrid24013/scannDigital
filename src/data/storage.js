import { File, Paths } from 'expo-file-system';

export function saveCopyToDocuments(tempUri) {
  const sourceFile = new File(tempUri);
  const destFile = new File(Paths.document, `scan_${Date.now()}.jpg`);

  sourceFile.copy(destFile);

  return destFile.uri;
}