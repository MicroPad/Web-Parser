export class Trie {
	public static readonly INDICES: { [notepadTitle: string]: Trie } = {};

	private readonly root: TrieNode;
	private readonly lastModified: Date;

	constructor(lastModified = new Date()) {
		this.root = new TrieNode();
		this.lastModified = lastModified;
	}

	public shouldReindex(lastModified: Date): boolean {
		return this.lastModified.getTime() > lastModified.getTime();
	}

	public add(key: string, ref: string): void {
		const keyChars = [...key];
		let node: TrieNode = this.root;

		for (let ch of keyChars) {
			if (!node.children[ch]) node.children[ch] = new TrieNode(ch);
			node = node.children[ch];
		}

		node.notes.push(ref);
	}

	public search(query: string): string[] {
		const keyChars = [...query];
		let node: TrieNode = this.root;

		for (let ch of keyChars) {
			if (!node.children[ch]) return [];
			node = node.children[ch];
		}

		return node.getAllFrom();
	}
}

class TrieNode {
	public readonly key: string;
	public readonly notes: string[] = [];
	public readonly children: { [ch: string]: TrieNode } = {};

	constructor(key = '\0') {
		this.key = key;
	}

	public getAllFrom(): string[] {
		return [
			...this.notes,
			...(Object.values(this.children))
				.reduce((acc, val) => acc.concat(val.getAllFrom()), [] as string[])
		];
	}
}