package tree_sitter_awatalk_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-awatalk"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_awatalk.Language())
	if language == nil {
		t.Errorf("Error loading Awatalk grammar")
	}
}
