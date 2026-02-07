export const SCAFFOLDS = {
    javascript: `/**
 * AlgoWars Unit Logic
 * 
 * @param {Object} context - The current game state visible to this unit
 * @param {Object} memory - Persistent memory across turns
 * @returns {Array} actions - List of actions to execute
 */
export function update(context, memory) {
    // Write your logic here
    // Example: 
    // const enemies = context.scan("ENEMY");
    // if (enemies.length > 0) {
    //     return [{ type: "ATTACK", target: enemies[0].id }];
    // }
    
    return [
        { type: "MOVE", direction: "NORTH" }
    ];
}`,
    python: `# AlgoWars Unit Logic

def update(context, memory):
    """
    Decide the next move for this unit.
    
    Args:
        context (dict): The current game state visible to this unit
        memory (dict): Persistent memory across turns
        
    Returns:
        list: Actions to execute
    """
    
    # Write your logic here
    # Example:
    # enemies = context.scan("ENEMY")
    # if enemies:
    #     return [{"type": "ATTACK", "target": enemies[0].id}]
    
    return [
        {"type": "MOVE", "direction": "NORTH"}
    ]
`
};
