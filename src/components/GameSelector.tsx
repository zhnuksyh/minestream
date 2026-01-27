import React from 'react';
import { Gamepad2, Pickaxe, Sword, Car, Ghost } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './ui/Card';

export type GameContextType = 'Minecraft' | 'FPS' | 'RPG' | 'Racing' | 'Horror';

interface GameSelectorProps {
    selectedGame: GameContextType;
    onSelect: (game: GameContextType) => void;
}

const GAMES: { id: GameContextType; label: string; icon: React.FC<any>; color: string }[] = [
    { id: 'Minecraft', label: 'Minecraft', icon: Pickaxe, color: 'text-green-400' },
    { id: 'FPS', label: 'Shooter', icon: Sword, color: 'text-red-400' },
    { id: 'RPG', label: 'RPG', icon: Gamepad2, color: 'text-purple-400' },
    { id: 'Racing', label: 'Racing', icon: Car, color: 'text-yellow-400' },
    { id: 'Horror', label: 'Horror', icon: Ghost, color: 'text-slate-400' },
];

export const GameSelector = ({ selectedGame, onSelect }: GameSelectorProps) => {
    return (
        <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Game Context</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {GAMES.map((game) => (
                    <button
                        key={game.id}
                        onClick={() => onSelect(game.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap border",
                            selectedGame === game.id
                                ? "bg-slate-700 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                                : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                        )}
                    >
                        <game.icon size={14} className={game.color} />
                        {game.label}
                    </button>
                ))}
            </div>
        </Card>
    );
};
