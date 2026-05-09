/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Workspace } from './components/Workspace';
import { CropTool } from './components/CropTool';

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Workspace />
      </div>
      <CropTool />
    </div>
  );
}
